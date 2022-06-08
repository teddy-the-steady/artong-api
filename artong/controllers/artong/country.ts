import { Country } from '../../models/index';
import { Forbidden } from '../../utils/error/errors';
import { NoPermission } from '../../utils/error/errorCodes';
import { hasBOPermission } from '../../utils/common/commonFunc';

const createCountry = async function(body: any, user: any) {
  if (!hasBOPermission(user.userGroups)) throw new Forbidden(NoPermission.message, NoPermission.code);

  const country = new Country({
    iso_code_3: body.iso_code_3,
    iso_code_2: body.iso_code_2,
    name: body.name,
    number_code: body.number_code,
  });

  const result = await country.createCountry();

  return {'data': result}
};

export {
	createCountry,
};