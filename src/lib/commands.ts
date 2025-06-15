export const serviceCommands: Record<string, string> = {
  minecraft: 
    `#!/bin/bash
sudo dnf install -y java-21-amazon-corretto
cd /home/ec2-user
mkdir -p minecraft && cd minecraft
wget https://piston-data.mojang.com/v1/objects/e6ec2f64e6080b9b5d9b471b291c33cc7f509733/server.jar -O minecraft_server.1.21.5.jar
echo "eula=true" > eula.txt

echo "SQUD [info] 서버 실행준비 완료"
echo "SQUD [info] 게임서버를 서비스로 등록합니다."

cat << EOF > /home/ec2-user/minecraft/auto-starter.sh
#1/bin/bash
cd /home/ec2-user/minecraft
nohup java -Xmx1024M -Xms1024M -jar minecraft_server.1.21.5.jar nogui &
EOF
    
chmod +x /home/ec2-user/minecraft/auto-starter.sh

cat << EOF > /etc/systemd/system/minecraft.service
[Unit]
Description=Minecraft Server
After=network.target

[service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/minecraft
ExecStart/home/ec2-user/minecraft/autostarter.sh
Restart=on-failure

[Install]
WantedBy=nulti-user.target
EOF
    
systemctl daemon-reexec
systemctl daemon-reload
systemctl enable minecraft
systemctl start minecraft
echo "SQUD [info] 모든 준비가 완료되어 서버를 실행합니다."
    `
  ,
//   추가할거 있으면 이렇게:
//     "하고 여기에 명령어"
//   
};