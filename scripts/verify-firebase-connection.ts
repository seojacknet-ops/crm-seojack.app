import { adminDb } from '../src/lib/firebase/admin';
import { getApp } from 'firebase-admin/app';

async function verifyConnection() {
    console.log('Verifying Firebase Connection...');

    try {
        const app = getApp('admin');
        console.log(`✅ Admin App initialized: ${app.name}`);

        // Check Project ID from config
        const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
        console.log(`ℹ️  Configured Project ID: ${projectId}`);

        if (projectId === 'seojack-crm') {
            console.log('✅ Project ID matches "seojack-crm"');
        } else {
            console.warn(`⚠️  Project ID "${projectId}" does NOT match expected "seojack-crm"`);
        }

        // Try a simple Firestore operation to verify credentials
        console.log('Attempting to list collections (verifies credentials)...');
        const collections = await adminDb.listCollections();
        console.log(`✅ Successfully connected to Firestore! Found ${collections.length} root collections.`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection verification failed:', error);
        process.exit(1);
    }
}

verifyConnection();
