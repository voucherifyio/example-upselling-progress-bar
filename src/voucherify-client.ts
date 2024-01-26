import { VoucherifyServerSide, VoucherifyServerSideOptions } from "@voucherify/sdk";


if(!process.env.VOUCHERIFY_APP_ID || !process.env.VOUCHERIFY_SECRET_KEY){
  throw new Error('Missing Voucherify credentials in configuration.')
}

const config: VoucherifyServerSideOptions = {
  applicationId: process.env.VOUCHERIFY_APP_ID as string,
  secretKey: process.env.VOUCHERIFY_SECRET_KEY as string,
};

if(typeof process.env.VOUCHERIFY_API_URL === 'string'){
  config.apiUrl = process.env.VOUCHERIFY_API_URL;
}

export const client = VoucherifyServerSide(config);
