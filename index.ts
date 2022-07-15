import 'dotenv/config';
import * as chok from 'chokidar';
import * as fs from 'fs';
import readLastLines, * as rll from 'read-last-lines';

const logFileLocation = process.env.LogFilePath
const log = console.log.bind(console);
const nameRegex = /<[^>]+>/g;

if (!logFileLocation) {
	throw new Error('.env file is missing the log file path');
}
if (!validateLogFile) {
	throw new Error('Log file is invalid (check the path in the .env file and that your factorio server is running)')
}

const logWatch = chok.watch(logFileLocation, { persistent: true });

// logWatch.on('change', () => {
// 	log(`Logfile change detected`)
// 	rll.read(logFileLocation, 1, "utf-8")
// 		.then((line) => get)
// })

function validateLogFile(path: string): boolean {
	if (fs.existsSync(path)) {
		try {
			const contents = fs.readFileSync(path);
			if (contents.toString().startsWith("=== Log opened")) {
				return true;
			}
		} catch (err) {
			console.error(err);
		}
	}
	return false;
}

// get a string that contains the sender's name as well as their message (spaces at start and end are trimmed)
function getChatContent(line: string): string | void {
	if (line.substring(20).startsWith("[CHAT]")) { // get rid of date and time prefix that all log entries have
		return line.substring(20 + 6).trim()
	}

	return
}

// isolate the player's name from getChatContent
function getPlayerName(content: string) {
	content = getChatContent(content)!;
	let name = content.match(nameRegex)?.at(0); // at this point, name is still wrapped in <>
	return name?.substring(1, name.length - 1);
}

// isolate the message
function getChatMessage(content: string): string | void {
	content = getChatContent(content)!;
	let name = content.match(nameRegex)?.at(0); // at this point, name is still wrapped in <>
	if (name) {
		return content.substring(name.length + 2); // strip the name and the ': ' from the content and return whats left ( the message )
	} else {
		return;
	}
}