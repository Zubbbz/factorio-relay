import 'dotenv/config';
import * as fs from 'fs';

const log = console.log.bind(console);
const error = console.error.bind(console);

function initialize() {
	// logfile
	if (validateLogFile() == false ) {
		throw new Error('Log file failed to validate!');
	} else {
		log('Logfile: ✅');
	}

	log('Ready to listen for logfile changes ✅');
}

// TODO: do the same thing without having to read the entire logfile
function validateLogFile(): boolean {
	let path = process.env.LogFilePath;

	if (!path) { return false; }

	if (fs.existsSync(path)) {
		try {
			let contents = fs.readFileSync(path);
			if (contents.toString().startsWith("=== Log opened")) {
				return true;
			}
		} catch(err) {
			error(err);
		}
	}

	return false;
}

function getChatContent(line: string): string | void {
	if (line.substring(20).startsWith("[CHAT]")) {
		return line.substring(20 + 6).trim() // 20 is for datetime, the +6 is for "[CHAT]"
	} else {
		return
	}
}

function getPlayerName(line: string): string { // we're going to assume the line passed in here is a valid chat line (bug fix later probs :D)
	let nameRegex = /<[^>]+>/g;
	let name = line.match(nameRegex)?.at(0);
	if (typeof name != 'string') {
		throw new Error('getPlayerName() was unable to find a name (string) using match.') // if you see this error, it might be an issue with getChatContent()
	}

	return name.substring(1, name.length - 1);
}

function getChatMessage(line: string): string {
	let name = getPlayerName(line);

	return line.substring(name.length + 2);
}

initialize();

