# OSRS account creator

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Description

Old School RuneScape is a massively multiplayer online role-playing game (MMORPG).

This project allows you to create accounts on OSRS. This doesn't verify emails, just solves all the anti-bot-related matters.

## Installation

1. Clone the repository: `git clone https://github.com/CatnipandMilk/osrs-account-creator.git`
2. Install the dependencies: `npm install`

## Usage

1. Replace the following details with your own details in the script file (`script.js`):
   - API_KEY_HERE: Your Scrappey API key found at https://app.scrappey.com/#/ to solve Cloudflare
   - EMAILS.TXT: fill this in with the emails you want to use for accounts

2. Run the script: `node create.js`



## Updates
1. Modified the code to pull emails from emails.txt for multiple accounts.
2. Modified the code to write the created accounts to accounts.xlsv
3. Should remove the used emails from emails.txt after it creates the account.




## Legal and Ethical Considerations

Remember to adhere to legal and ethical guidelines when scraping websites. Always respect the website's terms of service and scraping policies. Ensure your use of the scraped data complies with applicable laws and regulations, especially regarding data privacy and intellectual property rights. 🚫⚖️

*Disclaimer: This web scraping guide is intended solely for educational and informational purposes. Please use web scraping responsibly and in accordance with the terms and conditions of the target website.* 📚🔍
