import pandas as pd
from datetime import datetime

def split_email_password(input_file, output_file):
    # Read the existing Excel file if it exists
    try:
        existing_df = pd.read_excel(output_file)
    except FileNotFoundError:
        # If the file doesn't exist, create an empty DataFrame
        existing_df = pd.DataFrame(columns=['Email', 'Password'])

    # Read the input file and split email:password pairs
    with open(input_file, 'r') as file:
        lines = file.readlines()
        email_password_list = [line.strip().split(':') for line in lines]

    # Create a DataFrame with two columns: 'Email' and 'Password'
    new_df = pd.DataFrame(email_password_list, columns=['Email', 'Password'])

    # Check for existing email:password pairs and append only the new ones
    new_df = new_df[~new_df['Email'].isin(existing_df['Email'])]

    if not new_df.empty:
        # Add a date timestamp above the batch of new accounts
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        timestamp_row = pd.DataFrame({'Email': [f'Batch Timestamp: {timestamp}'], 'Password': ['']})

        # Concatenate the timestamp row and the new accounts DataFrame
        final_df = pd.concat([existing_df, timestamp_row, new_df])

        # Write the DataFrame to the Excel file
        final_df.to_excel(output_file, index=False)

        print(f"New Email:Password pairs have been successfully appended to {output_file}.")
    else:
        print("No new Email:Password pairs to append.")

if __name__ == "__main__":
    # Replace 'input.txt' with the path to your input file
    input_file_path = 'accounts.txt'

    # Replace 'accounts.xlsx' with the desired output Excel file name
    output_file_path = 'accounts.xlsx'

    split_email_password(input_file_path, output_file_path)
