import dotenv from 'dotenv';
import { Permit } from "permitio";
import fs from 'fs'

dotenv.config()
const permit = new Permit({
  token: process.env.PERMIT_API_KEY,
  pdp: "https://cloudpdp.api.permit.io",
});


async function getPermitioResources(){
    const response=await permit.api.resources.list()
    console.log(response)
    fs.writeFileSync('permit.json',JSON.stringify(response))
}

getPermitioResources()