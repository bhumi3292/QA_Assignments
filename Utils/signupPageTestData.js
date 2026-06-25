import dotenv from "dotenv";
dotenv.config();

export function generateTestEmail() {
    const uniqueId = Date.now().toString().slice(-6);
    const serverId = process.env.MAILOSAUR_SERVER_ID;
    return `tester_${uniqueId}.${serverId}@mailosaur.net`;
}

export function generateNewPassword() {
    return `Pass_${Math.random().toString(36).slice(-5)}1!`;
}

export function getRandomFirstName() {
    const names = ['Bhumi', 'Pallabi', 'Sarthak', 'Abrial'];
    return names[Math.floor(Math.random() * names.length)];
}

export function getRandomLastName() {
    const names = ['Subedi', 'Karki', 'Bhattarai', 'Singh', 'Shah'];
    return names[Math.floor(Math.random() * names.length)];
}

export function getRandomPhoneNumber() {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
    return `98${randomDigits}`;
}

