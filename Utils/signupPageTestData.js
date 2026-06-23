export function generateTestEmail() {
    const timestamp = Date.now().toString().slice(-6); 
    return `test${timestamp}@gmail.com`;
}

export function getRandomUsername() {
    const usernames = ['Admin', 'Manager', 'Supervisor'];
    return usernames[Math.floor(Math.random() * usernames.length)];
}

export function generateNewPassword() {
    return `Pass${Math.random().toString(36).slice(-8)}!`;
}

