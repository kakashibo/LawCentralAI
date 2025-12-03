from transformers import BartForConditionalGeneration, BartTokenizer
import fitz
import os
import argparse
import concurrent.futures
import nltk


COURT_DIR = "../data/Court_PDFs"

# Load the BART model and tokenizer
model_name = "facebook/bart-large-cnn"
tokenizer = BartTokenizer.from_pretrained(model_name)
model = BartForConditionalGeneration.from_pretrained(model_name)


# Function to extract text from a PDF file
def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    text = ""
    with fitz.open(file_path) as doc:
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
    return text


# Function to call BART model to summarize the text
def summarize_text_bart(text, max_length=1024):
    inputs = tokenizer.encode(text, return_tensors="pt", truncation=True)
    summary_ids = model.generate(inputs, max_length=max_length, min_length=100, length_penalty=2.0, num_beams=4, early_stopping=True)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)


# Split text into chunks based on sentences and token limits
def split_text_into_chunks(text, max_tokens=1024):
    """Split text into chunks that fit within the model's token limit."""
    sentences = nltk.tokenize.sent_tokenize(text)
    chunks = []
    current_chunk = []
    current_length = 0

    for sentence in sentences:
        sentence_length = len(tokenizer.encode(sentence, truncation=True))

        if current_length + sentence_length > max_tokens:
            chunks.append(' '.join(current_chunk))
            current_chunk = [sentence]
            current_length = sentence_length
        else:
            current_chunk.append(sentence)
            current_length += sentence_length

    # Add the last chunk
    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks


# Parallelize summarization across chunks
def summarize_text_in_chunks_bart(text, max_tokens=1024):
    chunks = split_text_into_chunks(text, max_tokens)
    summary = ""

    # Use parallel processing to speed up summarization
    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = [executor.submit(summarize_text_bart, chunk) for chunk in chunks]
        for future in concurrent.futures.as_completed(futures):
            summary += future.result() + "\n\n"

    return summary


# Main function to generate the report
def generate_legal_report(pdf_path):
    # Extract text from the PDF
    text = extract_text_from_pdf(pdf_path)

    # Define the prompt for summarization (if using OpenAI, but here replaced by BART)
    prompt = """
    You are an AI Lawyer/LawyerGPT, Carefully analyze the Indian legal document or court case: We need a well-structured, detailed, and accurate report.
    The Report should be accurate, as detailed as possible, and contain all important and relevant details in legal context and more than 3000+ words.
    """

    # Summarize the text using BART in chunks
    report = summarize_text_in_chunks_bart(text)

    return report


# Function to save the summary in the correct format
def save_summary(report, court_name, year, filename):
    directory = f"../summary/Court_Summary/{court_name}/{year}"
    os.makedirs(directory, exist_ok=True)
    summary_file = os.path.join(directory, f"{filename}_summary.txt")

    with open(summary_file, 'w') as file:
        file.write(report)

    print(f"Summary saved at {summary_file}")


# Function to process PDFs in the given directory structure within a specific year range
def generate_summaries_for_year_range(court_name, start_year, end_year):
    court_dir = os.path.join(COURT_DIR, court_name)

    for year in range(start_year, end_year + 1):
        year_dir = os.path.join(court_dir, str(year))
        if not os.path.exists(year_dir):
            print(f"No directory found for {court_name} in {year}")
            continue

        for filename in os.listdir(year_dir):
            if filename.endswith(".pdf") or filename.endswith(".PDF"):
                pdf_path = os.path.join(year_dir, filename)
                print(f"Processing {filename} for {court_name} ({year})...")

                # Generate the legal report
                report = generate_legal_report(pdf_path)

                # Save the summary
                save_summary(report, court_name, year, filename.replace(".pdf", ""))


# Main execution block
if __name__ == "__main__":
    # Ask the user to input the directory path
    parser = argparse.ArgumentParser(description='Summarize legal documents and save them in court/year directories.')
    parser.add_argument('--court-name', type=str, help='Name of the court')
    parser.add_argument('--start-year', type=int, help='Start year for the range of legal documents to summarize')
    parser.add_argument('--end-year', type=int, help='End year for the range of legal documents to summarize')
    args = parser.parse_args()

    # Generate summaries for the provided court name and year range
    generate_summaries_for_year_range(args.court_name, args.start_year, args.end_year)
