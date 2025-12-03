# Nyay

Nyay is a project designed to scrape legal judgments and laws from the Indian Kanoon website and use the collected data to fine-tune language models (LLMs). The aim is to enhance the capabilities of LLMs in understanding and processing legal texts.

## Table of Contents

- [Features](#features)
- [Architecture Diagram](#architecture-diagram)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Fine-Tuning LLMs](#fine-tuning-llms)
- [Contributing](#contributing)
- [License](#license)

## Features

- Scrape judgments and laws from the Indian Kanoon website.
- Save scraped data in JSON format.
- Preprocess and prepare data for fine-tuning language models.
- Easy-to-extend and modular codebase.

## Architecture Diagram

![alt text](Architecture%20Diagram.png)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/nyay.git
    cd nyay
    ```

2. Set up a virtual environment (optional but recommended):

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. Install the required dependencies:

    ```sh
    pipenv install
    ```

## Usage

### Scraping Data

To scrape data from the Indian Kanoon website, use the `scraper.py` script. You can specify the range of years and COURT_NAME or ACT_NAME for which you want to scrape data.

```sh
python scraper.py --type court --name "Supreme Court of India" --start-year 1953 --end-year 1961
```

```sh
python scraper.py --type act --name "Union of India - Act" --start-year 1953 --end-year 1961
```

### Downloading PDFs

To download the PDFs of the scraped links, use the `download_data.py` script. You can specify the range of years and COURT_NAME for which you want to download data.

```sh
python download_data.py
```

### Fine-tune your LLM using the processed data (Not developed yet):

```sh
python fine_tune_llm.py
```

## Project Structure

The downloaded PDFs and JSON files are organized as follows:

```plaintext
nyay/
├── links/
│   └── Court_PDFs/
│       └── Supreme Court of India/
│           ├── 1966.json
│           ├── 1967.json
│           └── ...
├── scraper.py
└── download_data.py

```

```plaintext
nyay/
├── links/
│   └── Constitution_ACTs/
│       └── Union of India - Act/
│           ├── 1966.json
│           ├── 1967.json
│           └── ...
├── scraper.py
└── download_data.py

```

```plaintext
nyay/
├── data/
│   └── Court_PDFs/
│       └── Supreme Court of India/
│           ├── 1966/
│           │   ├── <PDF files>
│           ├── 1967/
│           │   ├── <PDF files>
│           └── ...
├── scraper.py
└── download_data.py

```
- **scraper.py**: Script to scrape data from the Indian Kanoon website.
- **download_data.py**: Script to download PDF documents using the scraped links.
- **links/Court_PDFs/Supreme Court of India/**: Directory to store the JSON files with links organized by year.

## Fine-Tuning LLMs

1. Ensure you have the necessary data for fine-tuning.
2. Follow the instructions in `fine_tune_llm.py` to fine-tune your chosen language model on the collected legal data.

### Example

To fine-tune a language model, run:

```sh
python fine_tune_llm.py --model_name your_pretrained_model --data_path path_to_data
```

## Resources

- [Costs and Benefits of Your Own LLM](https://medium.com/@maciej.tatarek93/costs-and-benefits-of-your-own-llm-79f58c0eb47f)
- [Run the Strongest Open Source LLM Model (Llama3-70B) with Just a Single 4GB GPU](https://ai.gopubby.com/run-the-strongest-open-source-llm-model-llama3-70b-with-just-a-single-4gb-gpu-7e0ea2ad8ba2)
- [Fine-Tuning Llama 2](https://www.datacamp.com/tutorial/fine-tuning-llama-2)
- [How to Fine-Tune an LLM (Part 1: Preparing a Dataset for Instruction Tuning)](https://wandb.ai/capecape/alpaca_ft/reports/How-to-Fine-Tune-an-LLM-Part-1-Preparing-a-Dataset-for-Instruction-Tuning--Vmlldzo1NTcxNzE2)
- [How Law ChatGPT Uses OpenAI to Create Legal Documents Online](https://lawchatgpt.com/blog/how-law-chatgpt-uses-openai-to-create-legal-documents-online)
- [Law-AI/LeSICiN](https://github.com/Law-AI/LeSICiN)
- [InLegalBERT on HuggingFace](https://huggingface.co/law-ai/InLegalBERT)
- [DALE](https://github.com/Sreyan88/DALE)
- [Opennyai Pipeline](https://github.com/OpenNyAI/Opennyai/blob/master/opennyai/pipeline.py)
- [Bonito](https://github.com/BatsResearch/bonito)
- [Fitting Larger Networks into Memory](https://medium.com/tensorflow/fitting-larger-networks-into-memory-583e3c758ff9)
- [FLAN Templates](https://github.com/google-research/FLAN/blob/main/flan/v2/templates.py)
- [Bitsandbytes Optimizers](https://huggingface.co/docs/bitsandbytes/main/en/explanations/optimizers)
- [Bloom Megatron Deepspeed](https://huggingface.co/blog/bloom-megatron-deepspeed)
- [Large-Language-Model-Notebooks-Course](https://github.com/peremartra/Large-Language-Model-Notebooks-Course/tree/main/5-Fine%20Tuning)
- [LLM-Fine-Tuning](https://github.com/meetrais/LLM-Fine-Tuning)
- [Fine-Tune Large Language Model (LLM) on a Custom Dataset with QLoRA](https://dassum.medium.com/fine-tune-large-language-model-llm-on-a-custom-dataset-with-qlora-fb60abdeba07)
- [Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [Indian LawyerGPT](https://github.com/NisaarAgharia/Indian-LawyerGPT/tree/main)
- [Lawfyi](https://lawfyi.io/)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch with your feature or bugfix.
3. Commit your changes and push the branch to your fork.
4. Create a pull request with a description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to customize and enhance this README as needed for your project. If you encounter any issues or have suggestions for improvements, please open an issue or a pull request.