import { SSMClient, SendCommandCommand} from "@aws-sdk/client-ssm";

const REGION = "ap-northeast-2";

const ssm = new SSMClient({ region: REGION });

export async function runCommands(id: string, commands: string[]) {
  await ssm.send(
    new SendCommandCommand({
      InstanceIds: [id],
      DocumentName: "AWS-RunShellScript",
      Parameters: { commands },
    }),
  );
}