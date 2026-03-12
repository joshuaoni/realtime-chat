import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
console.log('CWD:', process.cwd());
console.log('Loading .env from:', envPath);

const result = dotenv.config();

if (result.error) {
    console.log('Dotenv Error:', result.error);
} else {
    console.log('Dotenv Success');
}

console.log('DATABASE_URL from process.env:', process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND');
console.log('All process.env keys:', Object.keys(process.env).filter(k => k === 'DATABASE_URL' || k === 'PORT'));
