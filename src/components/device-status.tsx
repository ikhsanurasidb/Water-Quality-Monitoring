import { getDeviceStatus } from "@/server/actions";

export type DeviceStatus = {
  status: string;
  wifi_status: string;
  aws_status: string;
};

export default async function DeviceStatus() {
  const res = await getDeviceStatus();

  console.log("res on dashboard: ", res);

  return (
    <div>
      <p>Device Status: {res?.status || 'Loading...'}</p>
      {/* <p>WiFi Status: {res?.wifi_status || 'Loading...'}</p> */}
      <p>AWS Status: {res?.aws_status || 'Loading...'}</p>
      <p>WIB Time: {getWIBTime()}</p>
    </div>
  );
}

function getWIBTime() {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  return now.toLocaleTimeString("id-ID", options);
}
