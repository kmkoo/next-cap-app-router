export const serviceCommands: Record<string, string> = {
  minecraft: 
    `#!/bin/bash
    sudo dnf update -y
    sudo dnf install -y java-21-amazon-corretto
    mkdir -p ~/minecraft && cd ~/minecraft
    wget https://piston-data.mojang.com/v1/objects/e6ec2f64e6080b9b5d9b471b291c33cc7f509733/server.jar -O minecraft_server.1.21.5.jar
    echo "eula=true" > eula.txt
    java -Xmx1024M -Xms1024M -jar minecraft_server.1.21.5.jar nogui`
  ,
//   추가할거 있으면 이렇게:
//     "하고 여기에 명령어"
//   
};