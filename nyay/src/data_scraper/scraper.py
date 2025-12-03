import requests
from bs4 import BeautifulSoup
import time
import json
import re
import os
import argparse

BASE_URL = 'https://indiankanoon.org'
PAGINATION_LIMIT = 1000
SLEEP_TIME = 1


def get_soup(url, session):
    """Retrieve and parse the HTML content of a URL."""
    response = session.get(url)
    response.raise_for_status()
    return BeautifulSoup(response.content, 'html.parser')


def scrape_links(court_or_act_name, valid_years, type):
    """Scrape links from the website."""
    DIR = os.path.join("../links", "Court_PDFs" if type == "court" else "Constitution_ACTs", court_or_act_name)
    base_browse_url = f'{BASE_URL}/browse/' if type == "court" else f'{BASE_URL}/browselaws/'
    with requests.Session() as session:
        soup = get_soup(base_browse_url, session)
        results = [a for a in soup.find_all('a', href=True) if a['href'].startswith('/browse')]

        final_list = {}
        for court_or_act in results:
            if court_or_act.get_text() != court_or_act_name:
                continue
            court_or_act_url = BASE_URL + court_or_act['href']

            court_or_act_soup = get_soup(court_or_act_url, session)
            years = [a for a in court_or_act_soup.find_all('a', href=True) if a['href'].startswith('/browse')]

            for year in years:
                year_text = year.get_text()
                if not year_text.isdigit() or int(year_text) not in valid_years:
                    continue

                year_url = BASE_URL + year['href']
                year_data = load_existing_data(court_or_act_name, year_text, type)
                if year_data:
                    print(f"Data for year {year_text} already exists. Skipping download.")
                    final_list[year_text] = year_data
                    continue
                final_list[year_text] = []

                year_soup = get_soup(year_url, session)
                months = [a for a in year_soup.find_all('a', href=True) if a['href'].startswith('/search/?')]
                months = [x for x in months if x.contents[0] != 'Entire Year']
                for month in months:
                    for page_num in range(PAGINATION_LIMIT):
                        time.sleep(SLEEP_TIME)
                        month_url = f"{BASE_URL}{month['href']}&pagenum={page_num}"
                        month_soup = get_soup(month_url, session)

                        doc_links = [a for a in month_soup.find_all('a', href=True) if
                                     a['href'].startswith('/doc' if type == "act" else '/docfragment')]
                        if not doc_links:
                            break

                        for doc in doc_links:
                            match = re.search(r'/docfragment/(\d+)/\?formInput', doc['href']) if type == "court" else re.search(r'/doc/(\d+)/', doc['href'])
                            if match:
                                doc_number = match.group(1)
                                doc_url = f"{BASE_URL}/doc/{doc_number}/"
                                final_list[year_text].append(doc_url)
                                print(doc_url)
                            else:
                                print("Document number not found in the URL.")
                print(f"Completed scraping for year {year_text} in court {court_or_act_name}")
                save_to_json(final_list[year_text], os.path.join(DIR, f"{year_text}.json"))
        return final_list


def load_existing_data(name, year, type):
    """Load existing data from a JSON file if it exists."""
    file_path = os.path.join("../links", "Court_PDFs" if type == "court" else "Constitution_ACTs", name, f"{year}.json")
    if os.path.exists(file_path):
        with open(file_path, "r") as infile:
            return json.load(infile)
    return {}


def save_to_json(data, filename):
    """Save data to a JSON file."""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as outfile:
        json.dump(data, outfile, separators=(',', ':'))
    print(f"Data saved to {filename}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scrape Indian Kanoon website for court documents.")
    parser.add_argument('--type', type=str, required=True, choices=["court", "act"],
                        help="Type of data to scrape (court or act)")
    parser.add_argument('--name', type=str, required=True, help="Name of the court or act to scrape data for")
    parser.add_argument('--start-year', type=int, required=True, help="Start year for scraping data")
    parser.add_argument('--end-year', type=int, required=True, help="End year for scraping data")
    args = parser.parse_args()

    valid_years = range(args.start_year, args.end_year + 1)
    scraped_links = scrape_links(args.name, valid_years, args.type)
