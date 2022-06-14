import { Country, Member } from '../../models/index';
import { Forbidden } from '../../utils/error/errors';
import { NoPermission } from '../../utils/error/errorCodes';
import { hasBOPermission } from '../../utils/common/commonFunc';

const postCountry = async function(body: any, member: Member) {
  if (!hasBOPermission(member.memberGroups)) throw new Forbidden(NoPermission.message, NoPermission.code);

  const countryModel = new Country({
    iso_code_3: body.iso_code_3,
    iso_code_2: body.iso_code_2,
    name: body.name,
    number_code: body.number_code
  });

  const result = await countryModel.createCountry(
    countryModel.iso_code_3,
    countryModel.iso_code_2,
    countryModel.name,
    countryModel.number_code
  );

  return {'data': result}
};

export {
	postCountry,
};