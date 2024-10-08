import { describe, it, expect } from 'vitest';
import { validateS10Barcode } from './App'; // Import the validation function

describe('validateS10Barcode', () => {
  it('should return true for a valid S10 barcode', () => {
    const validBarcode = 'AB123456785CD';  // Corrected valid barcode example
    const result = validateS10Barcode(validBarcode);
    expect(result).toBe(true);  // Expecting true for a valid barcode
  });

  it('should return false for an invalid S10 barcode format', () => {
    const invalidBarcode = '1234567890AB';  // Invalid format (missing letters at start/end)
    const result = validateS10Barcode(invalidBarcode);
    expect(result).toBe(false);  // Expecting false due to incorrect format
  });

  it('should return false for a valid format but incorrect check digit', () => {
    const wrongCheckDigitBarcode = 'AB123456784CD';  // Valid format but wrong check digit
    const result = validateS10Barcode(wrongCheckDigitBarcode);
    expect(result).toBe(false);  // Expecting false due to incorrect check digit
  });

  it('should return false for an S10 barcode with letters in the middle', () => {
    const invalidBarcodeWithLetters = 'AB12C456783CD';  // Invalid because of letter in digit area
    const result = validateS10Barcode(invalidBarcodeWithLetters);
    expect(result).toBe(false);  // Expecting false due to invalid digit region
  });

  it('should return false for an S10 barcode with an incorrect length', () => {
    const invalidLengthBarcode = 'AB12345678CD';  // Invalid because it has fewer characters
    const result = validateS10Barcode(invalidLengthBarcode);
    expect(result).toBe(false);  // Expecting false due to incorrect length
  });
});
