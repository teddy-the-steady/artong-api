import * as member from './member';
import * as country from './country';
import * as reactions from './reactions';
import * as projects from './projects';
import * as contents from './contents';
import * as search from './search';
import * as offers from './offers';
import * as follow from './follow';
import * as main from './main';
import * as report from './report';

interface PaginationInfo {
	start_num: string
	count_num: string
}

interface PageAndOrderingInfo extends PaginationInfo {
	order_by: string
	order_direction: string
}

export {
	member,
	country,
	reactions,
	projects,
	contents,
	search,
	offers,
	follow,
	main,
	report,
	PaginationInfo,
	PageAndOrderingInfo,
};