# -*- coding: utf-8 -*-
import os
import json
import requests
from tqdm import tqdm
import pikepdf
import argparse
import re

COURT_DIR = "../links/Court_PDFs"
COURT_DIR_SAVE = "../data/Court_PDFs"

def changefile(file_path):
    print("Processing {0}".format(file_path))
    try:
        pdf = pikepdf.Pdf.open(file_path)
        last_page_num = len(pdf.pages)
        pdf.pages.remove(p=last_page_num)
        pdf.save(file_path + '.tmp')
        pdf.close()
        os.unlink(file_path)
        os.rename(file_path + '.tmp', file_path)
        print("Processed: {0}".format(file_path))
    except Exception as e:
        print(f"Error processing {file_path}: {e}")


def download_pdf(url, directory="."):
    try:
        headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "User-Agent": "Mozilla/5.0",
            "Cache-Control": "no-cache",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "Connection": "keep-alive",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept-Language": "en-GB,en;q=0.9,en-US;q=0.8,hi;q=0.7",
            "Origin": "https://indiankanoon.org",
            "referer": url,
            "upgrade-insecure-requests": "1",
        }
        params = {
            'switchLocale': 'y',
            'siteEntryPassthrough': 'true'
        }
        data = {"type": "pdf"}
        response = requests.post(url, data, headers=headers, params=params, stream=True)
        if response.status_code == 200:
            total_size = int(response.headers.get('content-length', 0))
            d = response.headers['content-disposition']
            filename = re.findall("filename=\"(.+)\"", d)[0]
            filepath = os.path.join(directory, filename)
            with open(filepath, 'wb') as f, tqdm(
                desc=filename,
                total=total_size,
                unit='B',
                unit_scale=True,
                unit_divisor=1024,
            ) as progress_bar:
                for chunk in response.iter_content(chunk_size=1024):
                    f.write(chunk)
                    progress_bar.update(len(data))
            print(f"Downloaded: {filename}")
            # changefile(filepath)  # Process the downloaded PDF file
        else:
            print(f"Failed to download from: {url}")
    except Exception as e:
        print(f"Error occurred while downloading from {url}: {e}")


def download_court_pdfs(data_item, year_range, court_name):
    court_dir = os.path.join(COURT_DIR_SAVE, court_name)
    for year in year_range:
        year_str = str(year)
        if year_str in data_item:
            links = data_item[year_str]
            print(f"Downloading PDFs for the year {year_str} of {court_name}:")
            directory = os.path.join(court_dir, year_str)
            os.makedirs(directory, exist_ok=True)
            for link in links:
                download_pdf(link, directory)
        else:
            print(f"No data found for the year {year_str}")


def load_existing_data(court_name):
    """Load existing data from JSON files if they exist."""
    existing_data = {}
    court_dir = os.path.join(COURT_DIR, court_name)
    for filename in os.listdir(court_dir):
        if filename.endswith(".json"):
            year = filename.split(".")[0]
            file_path = os.path.join(court_dir, filename)
            with open(file_path, "r") as infile:
                existing_data[year] = json.load(infile)
    return existing_data


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Download PDF data for a specific court and year range from Indian Kanoon.')
    parser.add_argument('--court-name', type=str, required=True, help='Name of the court')
    parser.add_argument('--start-year', type=int, required=True, help='Start year for the range of PDFs to download')
    parser.add_argument('--end-year', type=int, required=True, help='End year for the range of PDFs to download')
    args = parser.parse_args()

    year_range = range(args.start_year, args.end_year + 1)
    court_name = args.court_name
    existing_data = load_existing_data(court_name)
    download_court_pdfs(existing_data, year_range, court_name)

