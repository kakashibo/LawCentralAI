import os
import torch
import transformers
import datasets
import argparse
from transformers import LlamaTokenizer, LlamaForCausalLM, Trainer, TrainingArguments
from transformers import DataCollatorForLanguageModeling
from datasets import load_dataset
import bitsandbytes as bnb
import wandb


def parse_args():
    parser = argparse.ArgumentParser(description="Fine-tune a Llama model on custom data.")
    parser.add_argument("--model_name", type=str, default="facebook/llama-2",
                        help="Model name or path to pretrained model")
    parser.add_argument("--dataset_path", type=str, required=True, help="Path to the training dataset")
    parser.add_argument("--output_dir", type=str, default="./output", help="Directory to save the fine-tuned model")
    parser.add_argument("--num_train_epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=8, help="Training batch size")
    parser.add_argument("--learning_rate", type=float, default=5e-5, help="Learning rate")
    parser.add_argument("--weight_decay", type=float, default=0.01, help="Weight decay")
    parser.add_argument("--warmup_steps", type=int, default=500, help="Number of warmup steps")
    parser.add_argument("--logging_dir", type=str, default="./logs", help="Directory for storing logs")
    parser.add_argument("--use_wandb", action="store_true", help="Use Weights & Biases for logging")
    args = parser.parse_args()
    return args


def main():
    args = parse_args()

    if args.use_wandb:
        wandb.init(project="llama-fine-tuning", config=args)

    # Load tokenizer and model
    tokenizer = LlamaTokenizer.from_pretrained(args.model_name)
    model = LlamaForCausalLM.from_pretrained(args.model_name)

    # Load dataset
    dataset = load_dataset('json', data_files=args.dataset_path, split='train')

    # Tokenize dataset
    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True, max_length=512)

    tokenized_dataset = dataset.map(tokenize_function, batched=True)

    # Data collator for language modeling
    data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    # Training arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        overwrite_output_dir=True,
        num_train_epochs=args.num_train_epochs,
        per_device_train_batch_size=args.batch_size,
        learning_rate=args.learning_rate,
        weight_decay=args.weight_decay,
        warmup_steps=args.warmup_steps,
        logging_dir=args.logging_dir,
        logging_steps=10,
        save_steps=10,
        save_total_limit=2,
        fp16=True,  # Enable mixed precision training
        report_to="wandb" if args.use_wandb else None
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        data_collator=data_collator,
        tokenizer=tokenizer,
    )

    # Train the model
    trainer.train()

    # Save the final model
    trainer.save_model(args.output_dir)


if __name__ == "__main__":
    main()
