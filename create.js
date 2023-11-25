import Scrappey from "scrappey-wrapper";
import qs from "qs";
import { readFileSync, writeFileSync } from "fs";

/**
 * Get your API key on Scrappey.com
 */
const scrappey = new Scrappey("YOUR API KEY HERE");

/**
 * Fill in the details to register with OSRS
 */
const MIN_PASSWORD_LENGTH = 7;
const MAX_PASSWORD_LENGTH = 12;
const DAY = '06';
const MONTH = '06';
const YEAR = '2006';

/**
 * Text file path
 */
const textFilePath = 'accounts.txt'; // This is where it will save the accounts

/**
 * Read email addresses from the file
 */
let emails = readFileSync('emails.txt', 'utf8').split('\n').map(email => email.trim());

/**
 * Generate a random password within the specified length range
 */
function generateRandomPassword() {
    const length = Math.floor(Math.random() * (MAX_PASSWORD_LENGTH - MIN_PASSWORD_LENGTH + 1)) + MIN_PASSWORD_LENGTH;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}

/**
 * Write account details to the text file
 */
function writeToTextFile(data) {
    const textData = data.map(entry => `${entry.Email}:${entry.Password}`).join('\n');
    writeFileSync(textFilePath, textData + '\n', { flag: 'a', encoding: 'utf8' });
}

/**
 * Remove used email from emails.txt
 */
function removeUsedEmail(email) {
    emails = emails.filter(existingEmail => existingEmail !== email);
    writeFileSync('emails.txt', emails.join('\n'), 'utf8');
    console.log(`Removed email ${email} from emails.txt`);
}

/**
 * This will only send the GET request, get the CSRF, and then send the POST request
 * All captchas are solved automatically, including Incapsula anti-bot and turnstile using Scrappey.
 */
async function run() {
    for (const email of emails) {
        let retryCount = 0;
        let success = false;

        while (retryCount < 3 && !success) {
            try {
                const password = generateRandomPassword();

                const createSession = await scrappey.createSession();
                const session = createSession.session;

                console.log(`Found session ${session} for email ${email}`);

                const get = await scrappey.get({
                    session: session,
                    url: 'https://secure.runescape.com/m=account-creation/create_account?theme=oldschool'
                });

                const csrf = get.solution.response.match(new RegExp(`<input type="hidden" name="csrf_token" value="(.*)" data-test="csrf-token">`))[1];

                const postData = {
                    theme: "oldschool",
                    flow: "web",
                    email1: email,
                    onlyOneEmail: 1,
                    password1: password,
                    onlyOnePassword: 1,
                    day: DAY,
                    month: MONTH,
                    year: YEAR,
                    agree_terms: 1,
                    "create-submit": "create",
                    csrf_token: csrf
                };

                const post = await scrappey.post({
                    session: session,
                    url: 'https://secure.runescape.com/m=account-creation/create_account',
                    postData: qs.stringify(postData),
                });

                console.log(`Response for email ${email}:`);
                console.log(post.solution.response); // Log the entire response for further analysis

                console.log(`Inner Text: ${post.solution.innerText}`);
                console.log(`Title: ${post.solution.title}`);

                // Log the account details to the text file
                const accountDetails = {
                    Email: email,
                    Password: password,
                };
                writeToTextFile([accountDetails]);

                // Remove used email from emails.txt
                removeUsedEmail(email);

                await scrappey.destroySession(session);

                success = true; // Mark the operation as successful to exit the retry loop
            } catch (error) {
                console.error(`Error for email ${email}:`, error.message);
                retryCount += 1;
            }
        }

        if (!success) {
            console.error(`Failed to process email ${email} after 3 retries. Skipping.`);
        }
    }
}

run().then(() => {});
