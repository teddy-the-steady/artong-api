import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import isEthereumAddressValidator from 'validator/lib/isEthereumAddress';

export function IsNotEthereumAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsNotEthereumAddress',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && !isEthereumAddressValidator(value);
        },
      },
    });
  };
}