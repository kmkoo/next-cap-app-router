import { DescribeInstancesCommand, EC2Client, RunInstancesCommand } from "@aws-sdk/client-ec2";

const ec2Client = new EC2Client({ region: process.env.AWS_REGION });

export async function getInstanceData(instanceId:string) {
  const command = new DescribeInstancesCommand({
    InstanceIds: [instanceId],
  });

  const response = await ec2Client.send(command);
  const instance = response.Reservations?.[0]?.Instances?.[0];

  return instance;
}

export async function createInstance(params:{
  imageId: string,
  keyName?: string,
  tagName?: string,
  userCommand?: string,
}) {
  const { imageId, keyName, tagName, userCommand } = params;

  // 서버가 생성된 후 실행할 명령어를 command에 받아옴
	const script = `#!/bin/bash\n${userCommand}`;
	const userData = Buffer.from(script).toString("base64");

  const command = new RunInstancesCommand({
    ImageId: imageId,
    InstanceType: "t3.small",
    MinCount: 1,
    MaxCount: 1,
    KeyName: keyName,
    TagSpecifications: tagName ? [
    {
      ResourceType: 'instance',
      Tags: [
        { Key: "name", Value: tagName }
      ]
    }
    ] : undefined,
		UserData: userData,
  });
  
  const response = await ec2Client.send(command);
  return response.Instances?.[0];
}