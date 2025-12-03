from openai import OpenAI
import fitz
import os
import argparse

COURT_DIR = "../data/Court_PDFs"
# Define the system message
system_msg = """
 You are Lawyer GPT, A Top Quality Lawyer in Indian Law.
    Your skills are :
    1. Legal Expertise: Possesses strong knowledge of constitutional law and can interpret complex legal principles.
    2. Research and Analysis: Excels in conducting thorough legal research and in-depth case analysis.
    3. Communication and Negotiation: Demonstrates excellent communication and successful negotiation skills.
    4. Client Advocacy: Proficient in representing and defending client interests in courts and tribunals.
    5. Client Relationship Management: Skilled in maintaining effective communication and ensuring client satisfaction.
    However, it's essential to underline the importance of providing accurate information. Rather than inventing or fabricating data, it is more respectable and credible to admit "I don't know" if you are unsure about the correct information.
"""


# Function to extract text from a PDF file
def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    text = ""
    with fitz.open(file_path) as doc:
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            text += page.get_text()
    return text


# Function to call the OpenAI API to summarize the text
def summarize_text(text, prompt):
    openai_api_key = ''
    client = OpenAI(api_key=openai_api_key)

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": prompt + "\n\n" + text}
        ]
        # max_tokens=600,
        # n=1,
        # stop=None,
        # temperature=0.7
    )
    return response.choices[0].message.content


def split_text_into_chunks(text, max_tokens=7500):
    """Split text into chunks that fit within the model's token limit."""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0

    for word in words:
        current_length += len(word) + 1  # +1 for the space or tokenization impact
        if current_length > max_tokens:
            chunks.append(' '.join(current_chunk))
            current_chunk = [word]
            current_length = len(word) + 1
        else:
            current_chunk.append(word)

    # Add the last chunk
    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks


def summarize_text_in_chunks(text, prompt):
    chunks = split_text_into_chunks(text)
    summary = ""

    for chunk in chunks:
        response = summarize_text(chunk, prompt)
        summary += response + "\n\n"

    return summary


# Main function to generate the report
def generate_legal_report(pdf_path):
    # Extract text from the PDF
    text = extract_text_from_pdf(pdf_path)

    # Define the prompt for summarization
    prompt = """
    You are an AI Lawyer/LawyerGPT, Carefully analyze the Indian legal document or court case: We need a well-structured, detailed, and accurate report.
    The Report should be accurate, as detailed as possible, and contain all important and relevant details in legal context and more than 3000+ words.

    The report should be in this format and detailed:
    Case Citation: The formal identification of the case, including the parties involved, the court, the year, and the case number & Bench Details.(Mandatory)

    Headnotes: This is the most important section, Headnotes of court case provide details of the case's key aspects, including legal principles, Issues addressed, Outcomes, Key facts, Issues, Reasoning and Implication. 
    I want 2 versions of headnotes:
    Headnotes 1:
    Type of Case: [Type of Case]
    Key Decision: [Key Decision]
    Main Issue: [Main Issue]
    Party Challenging Decision: [Party Challenging Decision]
    Key Legal Principle: [Key Legal Principle]
    Specific Question of Law: [Specific Question of Law]
    Key Evidence: [Key Evidence]

    Headnotes 2:
    [Short concise version giving all important information]

    Legal proposition: A description of the relevant facts leading to the dispute. (Mandatory)
    Case History: The journey of the case through the lower courts, including any decisions, judgments, or appeals made prior to the current court. (Mandatory)

    Legal Issues/Questions Presented: The precise legal questions that the court is being asked to answer. (Mandatory)

    Applicable Legal Provisions: The specific provisions of Indian statutes or laws that apply to the case. Indian courts often reference specific articles, sections, and clauses from the Constitution of India or other laws. (Mandatory)

    Holding(s): The court's answer(s) to the legal questions. This is the decision or verdict. (Mandatory)

    Legal Reasoning/Rationale: An explanation of the legal principles, case precedents, and logic that the court used to arrive at its decision. (Mandatory)

    Rule of Law/Legal Principle Established or Applied: Identification of any legal rules or principles that were applied or created in the case. (Mandatory)

    Concurring and/or Dissenting Opinions: Summaries of any additional opinions offered by other judges. (Mandatory)

    Implications and Significance: A discussion on the potential effects of the decision on future cases, laws, and broader society. (Mandatory)

    Comments or Analysis: This might include legal criticism, discussion on public reaction, or how the case fits into broader legal trends. (Mandatory)

    The Report should be accurate, as detailed as possible, and contain all important and relevant details in legal context and more than 2000+ words.
    """

    # Call the OpenAI API to generate the report
    report = summarize_text_in_chunks(text, prompt)

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
