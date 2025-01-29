import { test, expect } from '@playwright/test';
import * as xlsx from 'xlsx';

// Utility function to read test data from Excel
function readExcelData(filePath: string, sheetName: string): any[] {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet);
}

// Test Suite: RESTful API Automation
test.describe('RESTful API Automation', () => {
    const apiUrl = 'https://api.restful-api.dev/objects';
    const excelFilePath = 'D:/RESTfulAPIAutomation/Test-Data/Post_TestCase1_Data.xlsx';
    const sheetName = 'Add_data';
    const testData = readExcelData(excelFilePath, sheetName);
    let createdObjectId: string;
    const data = testData[0];
    // Test Case 1: Add a new object using POST endpoint
    test('Add a new object', async ({ request }) => {
        const data = testData[3];
        const response = await request.post(apiUrl, {
            data: {
                name: data.name,
                data: {
                    Price: data.price,
                    CPUModel : data.cPUModel,
                    Capacity:data.capacity,
                    Year:data.year
                   
                }
            }
            
        });

        const responseBody = await response.json();
        createdObjectId = responseBody.id;
        console.log(responseBody);

        // Assertions
        expect(response.status()).toBe(200);
        expect(createdObjectId).toBeDefined();
        expect(responseBody.name).toBe(data.name);
       expect(responseBody.Year).toBe(data.Year);
        expect(responseBody.Price).toBe(data.Price);
        expect(responseBody.CPUModel).toBe(data.CPUModel);
        expect(responseBody.Capacity).toBe(data.Capacity);
        console.log(`Object added with ID: ${createdObjectId}`);
    });
    // Test Case 2: Retrieve the newly added object using GET by ID endpoint
   test('Retrieve newly added object', async ({ request }) => {
        const response = await request.get(`${apiUrl}/${createdObjectId}`);
        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(createdObjectId);
        console.log('Object retrieved:', responseBody);
    });

    // Test Case 3: Update all fields on the newly added object using PUT endpoint
    test('Update the object', async ({ request }) => {
        const updatedObject = { ...testData[0], price: '340' };
        const response = await request.put(`${apiUrl}/${createdObjectId}`, {
            data:{
                name: data.name,
                data:{
                    Price: updatedObject.price,
                    CPUModel : data.cPUModel,
                    Capacity:data.capacity,
                    Year:data.year
                }
            } 
        });

        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(createdObjectId);
        expect(responseBody.name).toBe(updatedObject.name);
        expect(responseBody.price).toBe(updatedObject.Price);
        console.log('Object updated:', responseBody);
    });

  // Test Case 4: Retrieve the updated object using GET by ID endpoint
    test('Retrieve updated object', async ({ request }) => {
        const response = await request.get(`${apiUrl}/${createdObjectId}`);
        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(createdObjectId);
       // expect(responseBody.name).toBe('Updated Object');
       // expect(responseBody.color).toBe('Yellow');
        console.log('Updated object retrieved:', responseBody);
    });

    // Test Case 5: Delete the updated object using DELETE endpoint
    test('Delete the object', async ({ request }) => {
        const response = await request.delete(`${apiUrl}/${createdObjectId}`);
        const responseBody = await response.json();

        // Assertions
        expect(response.status()).toBe(200);
        expect(responseBody.message).toContain('deleted');
        console.log(`Object with ID ${createdObjectId} deleted.`);
    });
});