import fetch from "node-fetch";
import { Logger } from "./logger";
import { ECDH, createCipheriv, createECDH, createHash } from "crypto";

export interface Options {
  username: string;
  password: string;
  country: string;
  logger?: Logger;
}

export interface LoginRequest {
  ab: string;
  client_secret_info: {
    public_key: string;
  },
  enc: number;
  email: string;
  password: string;
  time_zone: number;
  verify_code?: string;
  captcha_id?: string;
  answer?: string
  transaction: string;
}

export interface SuccessResponse<T> {
  code: 0;
  msg: "success!";
  data: T
}

export interface BaseResponse<T> {
  code: number;
  msg: string;
  data?: T;
  outline?: any;
  trace_id: string;
}

export type ResultResponse<T> = BaseResponse<T> & SuccessResponse<T>;

export interface LoginResultResponse {
  user_id: string;
  email: string;
  nick_name: string;
  auth_token: string;
  token_expires_at: number;
  avatar: string;
  invitation_code?: string;
  inviter_code?: string;
  verify_code_url?: string;
  mac_addr: string;
  domain: string;
  ab_code: string;
  geo_key: string;
  privilege: number;
  phone: string;
  phone_code: string;
  server_secret_info: {
    public_key: string
  } | null,
  params: Array<{
    param_type: number;
    param_value: string;
  }> | null;
  trust_list: Array<TrustDevice> | null;
  token_id: number;
  fa_info: {
    step: number;
    info: string;
  },
  country_code: string;
}

export interface DeviceData {
  device_sn: string;
  product_code: string;
  bt_ble_id: string;
  bt_ble_mac: string;
  device_name: string;
  alias_name: string;
  img_url: string;
  link_time: number;
  wifi_online: boolean;
  wifi_name: string;
  relate_type: string[];
  charge: boolean;
  bws_surplus: number;
  device_sw_version: string;
}

export interface DeviceDataResponse {
  data: DeviceData[];
}

interface SiteHomepageResponse {
  site_list: Site[],
  solar_list: any[],
  pps_list: any[],
  solarbank_list: Solarbank[],
}

interface SiteListResponse {
  site_list: Site[]
}

export interface UserMqttInfo {
  /**
   * A unique identifier for the user.
   * Typically a SHA-1 hash or similar.
   */
  user_id: string;

  /**
   * A string that denotes the name of the application.
   */
  app_name: string;

  /**
   * Formed as a combination of the user_id and app_name.
   */
  thing_name: string;

  /**
   * Identifier for a certificate.
   */
  certificate_id: string;

  /**
   * A PEM-formatted X.509 certificate.
   */
  certificate_pem: string;

  /**
   * The RSA private key, PEM-formatted.
   */
  private_key: string;

  /**
   * RSA Public key, PEM-formatted. Was always empty
   */
  public_key: string;

  /**
   * Address of the MQTT endpoint.
   */
  endpoint_addr: string;

  /**
   * A PEM-formatted Root CA certificate.
   * Used to validate the authenticity of the remote server.
   */
  aws_root_ca1_pem: string;

  origin: string;
  
  /**
   * PKCS#12, a binary format for storing the server certificate, 
   * any intermediate certificates, and the private key in one encryptable file.
   */ 
  pkcs12: string;

}

export interface Site {
  site_id: string,
  site_name: string,
  site_img: string,
  device_type_list: number[]
}

export interface Solarbank {
  device_pn: string,
  device_sn: string,
  device_name: string,
  device_img: string,
  battery_power: `${number}`,
  bind_site_status: string,
  charging_power: `${number}`,
  power_unit: string,
  charging_status: `${number}`,
  status: `${number}`,
  wireless_type: `${number}`,
  main_version: `${number}`,
  photovoltaic_power: `${number}`,
  output_power: `${number}`
}

export interface ScenInfo {
  home_info: {
    home_name: string,
    home_img: string,
    charging_power: `${number}`,
    power_unit:string,
  },
  solar_list: any[],
  pps_info: {
    pps_list: any[],
    total_charging_power: `${number}`,
    power_unit:string,
    total_battery_power: `${number}`,
    updated_time: string,
    pps_status: number,
  },
  statistics: Array<{
    type: `${number}`,
    total: `${number}`
    unit: string,
  }>,
  topology_type:`${number}`,
  solarbank_info: {
    solarbank_list: Solarbank[],
    total_charging_power: `${number}`,
    power_unit: string,
    charging_status: `${number}`,
    total_battery_power: `${number}`,
    updated_time: string,
    total_photovoltaic_power: `${number}`,
    total_output_power: `${number}`
  },
  retain_load: string,
  updated_time: string,
  power_site_type: number,
}

export interface EnergyAnalysis {
  power: Array<{
    time:`${number}:${number}`,
    value:`${number}`
  }>,
  charge_trend: null,
  charge_level: any[],
  power_unit: string,
  charge_total: `${number}`,
  charge_unit: string,
  discharge_total: `${number}`,
  discharge_unit: string,
  charging_pre: `${number}`,
  electricity_pre: `${number}`,
  others_pre: `${number}`,
  statistics: Array<{
    type: `${number}`,
    total: `${number}`,
    unit:string
  }>
}

export interface LoadData {
  time: string;
  load: number;
}

export interface HomeLoadChartResponse {
  data: LoadData[];
}


export interface TrustDevice {
  open_udid: string;
  phone_model: string;
  is_current_device: number;
}

export interface ApplianceLoad {
  id: number;
  name: string;
  power: number;
  number: number;
}

export interface Range {
  id: number;
  start_time: string;
  end_time: string;
  turn_on: boolean;
  appliance_loads: ApplianceLoad[];
}

export interface LoadConfiguration {
  ranges: Range[];
  min_load: number;
  max_load: number;
  step: number;
}


export enum ParamType {
  LoadConfiguration = "4",
}

export type ParamData<T extends ParamType> = T extends ParamType.LoadConfiguration ? LoadConfiguration : string;

export interface SiteDeviceParamResponse<T extends ParamType> {
  param_data: ParamData<T>
}

export class SolixApi {
  private readonly SERVER_PUBLIC_KEY = "04c5c00c4f8d1197cc7c3167c52bf7acb054d722f0ef08dcd7e0883236e0d72a3868d9750cb47fa4619248f3d83f0f662671dadc6e2d31c2f41db0161651c7c076";

  private readonly username: string;

  private readonly password: string;
  
  private readonly country: string;

  private readonly timezone: string;

  private ecdh: ECDH = createECDH("prime256v1");
  
  private readonly logger: Logger;

  constructor(options: Options) {
    this.username = options.username;
    this.password = options.password;
    this.logger = options.logger ?? console;
    this.country = options.country.toUpperCase();
    this.timezone = this.getTimezoneGMTString();
    this.ecdh.generateKeys();
  }

  private md5(s: string) {
    this.logger.log(s);
    return createHash("md5").update(Buffer.from(s)).digest("hex");
  }

  private getTimezoneGMTString(): string {
    const tzo = -new Date().getTimezoneOffset();
    const dif = tzo >= 0 ? "+" : "-";
    return `GMT${dif}${this.pad(tzo / 60)}:${this.pad(tzo % 60)}`;
  }

  private pad(num: number): string {
    const norm = Math.floor(Math.abs(num));
    return `${(norm < 10 ? "0" : "")}${norm}`;
  }

  private encryptAPIData(data: string, key: Buffer): string {
    const cipher = createCipheriv("aes-256-cbc", key, key.slice(0, 16));
    return (
      cipher.update(data, "utf8", "base64") +
      cipher.final("base64")
    );
  }

  private async fetch(endpoint: string, data?: any, headers?: Record<string, string>) {
    this.logger.log(JSON.stringify(data));
    const urlBuilder = new URL(endpoint, "https://ankerpower-api-eu.anker.com");
    const url = urlBuilder.href;
    
    return fetch(url, {
      method: "POST",
      body: data != null ? JSON.stringify(data) : undefined,
      headers: {
        ["Content-Type"]: "application/json",
        Country: this.country,
        Timezone: this.timezone,
        ["Model-Type"]: "DESKTOP",
        ["App-Name"]: "anker_power",
        ["Os-Type"]: "android",
        ...headers,
      },
    });
  }

  public withLogin(login: LoginResultResponse) {
    const headers = { ["X-Auth-Token"]: login.auth_token, "gtoken": this.md5(login.user_id) };
    const authFetch = async <T>(endpoint: string, data?: any): Promise<ResultResponse<T>> => {
      const response = await this.fetch(endpoint, data, headers);
      return await response.json() as ResultResponse<T>;
    };
    return {
      getRelateAndBindDevices: async () => {
        const data = {};
        return authFetch<DeviceDataResponse>("/power_service/v1/app/get_relate_and_bind_devices", data);
      },
      getUserMqttInfo: async () => {
        return authFetch<UserMqttInfo>("/app/devicemanage/get_user_mqtt_info");
      },
      siteHomepage: async () => {
        const data = {};
        return authFetch<SiteHomepageResponse>("/power_service/v1/site/get_site_homepage", data);
      },
      getSiteList: async () => {
        const data = {};
        return authFetch<SiteListResponse>("/power_service/v1/site/get_site_list", data);
      },
      getHomeLoadChart: async ({
        siteId,
        deviceSn = "", // Was always an empty string
      }:{ 
        siteId: string,
        deviceSn?: string
      }) => {
        const data = { site_id:siteId, device_sn: deviceSn };
        return authFetch<HomeLoadChartResponse>("/power_service/v1/site/get_home_load_chart", data);
      },
      scenInfo: async (siteId: string) => {
        const data = { site_id: siteId };
        return authFetch<ScenInfo>("/power_service/v1/site/get_scen_info", data);
      },
      energyAnalysis:async ({
        siteId,
        deviceSn,
        type,
        startTime = new Date(),
        endTime,
        deviceType = "solar_production",
      }: {
        siteId: string, 
        deviceSn: string, 
        type: "day" | "week" | "year", 
        startTime?: Date, 
        endTime?: Date,
        deviceType?: "solar_production"
      }) => {
        const startTimeString = `${startTime.getUTCFullYear()}-${this.pad(startTime.getUTCMonth())}-${this.pad(startTime.getUTCDate())}`;
        const endTimeString = endTime != null ? `${endTime.getUTCFullYear()}-${endTime.getUTCMonth()}-${endTime.getUTCDate()}` : "";
        const data = {
          site_id: siteId,
          device_sn:deviceSn,
          type,
          start_time: startTimeString,
          device_type: deviceType,
          end_time: endTimeString,
        };
        return authFetch<EnergyAnalysis>("/power_service/v1/site/energy_analysis", data);
      },
      getSiteDeviceParam: async <T extends ParamType>({
        paramType,
        siteId,
      }:{
        paramType: T,
        siteId: string
      }): Promise<ResultResponse<SiteDeviceParamResponse<T>>> => {
        const data = { site_id: siteId, param_type: paramType };
        const response = await authFetch<{ param_data: string }>("/power_service/v1/site/get_site_device_param", data);
        if (response.data != null) {
          switch (paramType) {
            case ParamType.LoadConfiguration:
              return { ...response, data: { param_data: JSON.parse(response.data.param_data) as ParamData<T> } };
            default:
              return response as ResultResponse<SiteDeviceParamResponse<T>>;
          }
        }
        return response as ResultResponse<SiteDeviceParamResponse<T>>;
      },
      setSiteDeviceParam: async <T extends ParamType>({
        paramType,
        siteId,
        cmd = 17, // Unknown what this means but it's alway 17
        paramData,
      }:{
        paramType: T,
        siteId: string,
        cmd?: number,
        paramData: ParamData<T>,
      }) => {
        let data = { site_id: siteId, param_type: paramType, cmd, param_data: paramData as unknown };
        switch (paramType) {
          case ParamType.LoadConfiguration:
            data = { ...data, param_data: JSON.stringify(paramData) };
            break;
          default:
            // Should be a string already
        }
        return authFetch<Record<string, never>>("/power_service/v1/site/set_site_device_param", data);
      },
    };
  }

  public async login(): Promise<ResultResponse<LoginResultResponse>> {
    const data: LoginRequest = {
      ab: this.country,
      client_secret_info: {
        public_key: this.ecdh.getPublicKey("hex"),
      },
      enc: 0,
      email: this.username,
      password: this.encryptAPIData(this.password, this.ecdh.computeSecret(Buffer.from(this.SERVER_PUBLIC_KEY, "hex"))),
      time_zone: new Date().getTimezoneOffset() !== 0 ? -new Date().getTimezoneOffset() * 60 * 1000 : 0,
      transaction: `${new Date().getTime()}`,
    };
    const response = await this.fetch("/passport/login", data);
    if (response.status === 200) {
      return await response.json() as ResultResponse<LoginResultResponse>;
    } else {
      throw new Error(`Login failed (${response.status}): ${await response.text()}`);
    }
  }
}
