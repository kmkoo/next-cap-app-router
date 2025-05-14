import { _InstanceType, DescribeInstancesCommand, EC2Client, RunInstancesCommand, StartInstancesCommand, StopInstancesCommand, TerminateInstancesCommand } from "@aws-sdk/client-ec2";

const ec2Client = new EC2Client({ region: process.env.AWS_REGION });

export async function getInstanceData(instanceIds:string[]) {
  const command = new DescribeInstancesCommand({
    InstanceIds: instanceIds,
    DryRun: true,  // 실제 작동 방지
  });

  const response = await ec2Client.send(command);
  const instance = response.Reservations?.[0]?.Instances?.[0];

  return instance;
}

export async function createInstance(params:{
  imageId: string,
  instanceType: _InstanceType,
  serverTag: string,
  serverOwner: string,
  userCommand?: string,
}) {
  const { imageId, instanceType, serverTag, serverOwner, userCommand } = params;

  // 서버가 생성된 후 실행할 명령어를 command에 받아옴
	const script = `#!/bin/bash\n${userCommand}`;
	const userData = Buffer.from(script).toString("base64");

  const command = new RunInstancesCommand({
    ImageId: imageId,
    InstanceType: instanceType,
    MinCount: 1,
    MaxCount: 1,
    TagSpecifications: [{
      ResourceType: 'instance',
      Tags: [
        { Key: "Name", Value: "squirrel-ec2" },
        { Key: "group", Value: "capstone" },
        { Key: "username", Value: "capstone-squirrel" },
        { Key: "serviceName", Value: serverTag },
        { Key: "owner", Value: serverOwner },
      ]
    }],
		UserData: userData,
    DryRun: true,  // 실제 작동 방지
  });
  
  const response = await ec2Client.send(command);
  return response.Instances;
}

export async function startInstance(instanceIds:string[]) {
  const command = new StartInstancesCommand({
    InstanceIds: instanceIds,
    DryRun: true,  // 실제 작동 방지
  });

  const response = await ec2Client.send(command);
  return response.StartingInstances;
}

export async function stopInstance(instanceIds:string[]) {
  const command = new StopInstancesCommand({
    InstanceIds: instanceIds,
    DryRun: true,  // 실제 작동 방지
  });
  
  const response = await ec2Client.send(command);
  return response.StoppingInstances;
}

export async function terminateInstance(instanceIds:string[]) {
  const command = new TerminateInstancesCommand({
    InstanceIds: instanceIds,
    DryRun: true,  // 실제 작동 방지
  });

  const response = await ec2Client.send(command);
  return response.TerminatingInstances;
}