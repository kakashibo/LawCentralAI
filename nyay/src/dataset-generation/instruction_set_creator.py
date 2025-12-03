from openai import OpenAI, OpenAIError
import os
import json
import time

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


# Define the prompt creation function
def create_prompt(summary, task):
    template = f"""
    I will Provide you with a court case from Indian law, Think like a lawyer:
    I will give you tasks to perform on the case: Answers should be detailed and have important information,
    {summary}

    I am making a dataset for instruct tuning Large Language Model, Give me answer in this format : (Here are a couple of examples)
        {{
            "instruction": "Discuss potential legal reforms suggested by the decision in the provided case.",
            "input": "The case P.A. Inamdar & Ors vs State Of Maharashtra & Ors, Appeal (civil) 5041 of 2005, Supreme Court of India",
            "output": "The decision in the P.A. Inamdar case highlights a few key areas that could benefit from legal reform. One area is the precise definition and criteria of 'minorities' in the context of Article 30 of the Constitution, which can create a more clear-cut approach towards minority rights. Secondly, the government might need to formulate clear, transparent, and fair regulations concerning admission processes in both minority and non-minority institutions to avoid disparities and ensure quality education for all. The government can also consider establishing an independent regulatory body for monitoring and preventing maladministration in these institutions. These reforms would significantly improve the balance between preserving the rights of minorities and maintaining a high standard of education in India."
        }},
        {{
            "instruction": "Evaluate how the decision in the given case might impact a specific industry or sector in India.",
            "input": "The case P.A. Inamdar & Ors vs State Of Maharashtra & Ors, Appeal (civil) 5041 of 2005, Supreme Court of India",
            "output": "The decision in the P.A. Inamdar case primarily impacts the educational sector in India, particularly private institutions established by religious and linguistic minorities. It upholds their right to administer such institutions, albeit with certain regulatory boundaries. This might lead to a change in the administration policies of these institutions, particularly concerning their admission procedures, which should now be more transparent and merit-based. As a result, the competitive landscape might increase among these institutions to attract high-achieving students. Furthermore, the case may also have a bearing on policies related to affirmative action and minority rights in education, potentially leading to further judicial or legislative reforms in this sector."
        }},

    Make sure you fill all the fields / the instruction/input/output should be high quality and very detailed
    Provide me output strictly in the below format
    {{
        "instruction": "Mandatory'",(Instruction of the type of the legal Task)
        "input": "Optional",(User question or any type of user Input or Case Information)
        "output": "Mandatory."(Accurate answer)
    }},

    The format needs to be json, so instruction should be in one line, input in one line and output in one line. All keys should have one line.
    Only Return JSON OUTPUT
    Task:-
    {task}
    """
    return template

# Directory containing summary files
summary_directory = "content/"

# Load tasks from tasks.txt file
with open("Diverse_Instruction_Set_350.txt", "r") as f:
    tasks = f.readlines()

# Initialize a counter for processed tasks
processed_tasks = 0

# Set the limit for the number of tasks
task_limit = 80

# Process summary files from the directory
for summary_filename in os.listdir(summary_directory):
    # Read the summary file
    with open(os.path.join(summary_directory, summary_filename), 'r') as f:
        summary = f.read()

    # Process tasks for each summary file
    for task in tasks[processed_tasks:processed_tasks+task_limit]:
        # Create the user message with the current summary and task
        user_msg = create_prompt(summary, task.strip())

        # Maximum number of retries
        max_retries = 5
        # Initial delay in seconds
        delay = 1

        for i in range(max_retries):
            try:
                # Generate the content with OpenAI API
                openai_api_key = ''
                client = OpenAI(api_key=openai_api_key)

                response = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": system_msg},
                        {"role": "user", "content": user_msg}
                        ])
                # response = openai.ChatCompletion.create(
                #     model="gpt-3.5-turbo",
                #     temperature=0,
                #     messages=[
                #         {"role": "system", "content": system_msg},
                #         {"role": "user", "content": user_msg}
                #     ]
                # )
                # If the API call was successful, break out of the loop
                break
            except OpenAIError as e:
                if 'rate_limit_exceeded' in str(e):
                    print(f"Rate limit exceeded. Waiting for {delay} seconds before retrying...")
                    time.sleep(delay)
                    delay *= 2
                    continue
                else:
                    raise

        # Extract the content
        content = response.choices[0].message.content
        # Replace newline characters with spaces
        content = content.replace("\n", " ")
        # Print the output
        print(f"Output: {content}")

        # Convert the content to a JSON object
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            print(f"Failed to decode JSON for task: {task}")
            continue

        with open('output.json', 'a') as f:
            json.dump(data, f)
            # Add a newline after each JSON object
            f.write('\n')

        processed_tasks += 1
        # Print the progress
        print(f"Processed tasks: {processed_tasks}/{task_limit}")

print("Output written successfully to output.json file.")
print("Initiating file download...")
