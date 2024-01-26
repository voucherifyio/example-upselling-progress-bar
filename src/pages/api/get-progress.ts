import type { NextApiRequest, NextApiResponse } from 'next'
import { QualificationsRedeemable, ValidationRulesGetResponse } from "@voucherify/sdk";
import { client } from "../../voucherify-client";
import {ProgressThreshold} from '../../upselling-progress-bar';

type ValidationRulesWithOneRule = ValidationRulesGetResponse & {rules: {"1": {name: string, conditions: {"$more_than": [number]}}}}

const PROGRES_VECTOR_NAME = 'order.amount';

const getPromotionTiersWithUpsellingProgressBarFlag = async () => {
  const qualificationResponse = await client.qualifications.checkEligibility({
      scenario: "AUDIENCE_ONLY",
      order: {
          
          amount: 1000
      },
      options: {
          filters: {
              resource_type: {
                  conditions: {
                      '$is': ["promotion_tier"]
                  }
              }
          },
          limit: 100,
          expand: ["validation_rules", 'redeemable'],
      }
  })
  return qualificationResponse.redeemables.data.filter(redeemable => {
      if (!redeemable.metadata) {
          return false
      }
      if (typeof redeemable.metadata['upselling-progress-bar'] !== 'string') {
          return false
      }
      if (redeemable.metadata['upselling-progress-bar'] !== 'true') {
          return false
      }

      return true
  });
}

const getValidationRuleFromRedeemable = (redeemable: QualificationsRedeemable): string => {
  if (!redeemable.validation_rules_assignments?.data) {
      return ''; // todo  validation or error handling
  }
  // SDK is not aligned to real response from API - it's fixed in next RC https://docs.voucherify.io/v2018-08-01-mk-653/reference/introduction-1
  //@ts-ignore
  return redeemable.validation_rules_assignments.data[0].rule_id// map(vra => vra.rule_id)
}

const isValidationRuleProgressAligned = (valdiationRule: ValidationRulesGetResponse|ValidationRulesWithOneRule): valdiationRule is ValidationRulesWithOneRule => {
  if (!valdiationRule.rules || typeof valdiationRule.rules !== 'object') {
     return false
 }

 if (!valdiationRule.rules["1"] || typeof valdiationRule.rules["1"] !== 'object') {
     return false;
 }

 if (valdiationRule.rules["1"].name !== PROGRES_VECTOR_NAME) {
     return false;
 }

 if (typeof valdiationRule.rules["1"].conditions["$more_than"][0] !== 'number') {
     return false
 }
 return true;
}

const getThresholdFromValidationRule = (valdiationRule: ValidationRulesGetResponse): number | false => {
 if(!isValidationRuleProgressAligned(valdiationRule)){
     return false
 }
 return valdiationRule.rules["1"].conditions["$more_than"][0];
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProgressThreshold[]>
) {
  if (req.method !== "POST") {
    return res.status(404).end();
}
const promotionTiers = await getPromotionTiersWithUpsellingProgressBarFlag()

const progressThresholds: ProgressThreshold[] = (await Promise.all(promotionTiers.map(async redeembale => {
    const validationruleId = getValidationRuleFromRedeemable(redeembale);
    const campaignId = redeembale.campaign_id;
    const valdiationRule = await client.validationRules.get(validationruleId)
    const value = getThresholdFromValidationRule(valdiationRule)

    if (value === false || !campaignId) {
        return false
    }

    return {
        promotionTierId: redeembale.id,
        promotionBaner: redeembale.banner || '',
        validationruleId,
        campaignId,
        value
    }
}))).filter((e): e is ProgressThreshold => typeof e === 'object' )

return res.status(200).json(
    progressThresholds
);
}