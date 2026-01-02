import { rutClean, rutValidate, rutFormat } from './rut-helpers';

const testRut = '161415529';

console.log('Clean:', rutClean(testRut));
console.log('Validate:', rutValidate(testRut));
console.log('Format:', rutFormat(testRut));
