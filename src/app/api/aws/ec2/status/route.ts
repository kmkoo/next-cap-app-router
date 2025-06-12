import { getInstanceData } from "@/lib/aws-ec2";
import { NextRequest } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  const instance = await getInstanceData([params.id]);

  if (!instance) {
    return new Response("Instance not found", { status: 404 });
  }

  return Response.json({
    instanceId: instance.InstanceId,
    state: instance.State?.Name,
    publicIp: instance.PublicIpAddress,
    launchTime: instance.LaunchTime,
  });
}