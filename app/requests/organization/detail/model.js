import Model from "../../../modules/request/model";

export default class OrganizationDetailsModel extends Model {
  url () {
    return "http://localhost:2999/enterprise-api/v1/organization/details";
  }
}
