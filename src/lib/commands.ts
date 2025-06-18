export const serviceCommands: Record<string, string> = {
  minecraft: 
    `#!/bin/bash
sudo dnf install -y java-21-amazon-corretto
cd /home/ec2-user
mkdir -p minecraft
chown -R ec2-user:ec2-user /home/ec2-user/minecraft
cd minecraft
sudo -u ec2-user wget https://piston-data.mojang.com/v1/objects/e6ec2f64e6080b9b5d9b471b291c33cc7f509733/server.jar -O minecraft_server.1.21.5.jar
java -jar minecraft_server.1.21.5.jar --initSettings nogui 
sudo sed -i 's/eula=false/eula=true/g' eula.txt
sudo sed -i 's/enable-rcon=false/enable-rcon=true/g' server.properties
sudo sed -i 's/rcon.password=/rcon.password=${process.env.RCON_PASSWORD}/g' server.properties

echo "SQUD [info] 서버 실행준비 완료"
echo "SQUD [info] 게임서버를 서비스로 등록합니다."

cat << EOF > /home/ec2-user/minecraft/auto-starter.sh
#!/bin/bash
cd /home/ec2-user/minecraft
java -Xmx1024M -Xms1024M -jar minecraft_server.1.21.5.jar nogui
EOF
    
chmod +x /home/ec2-user/minecraft/auto-starter.sh
chown ec2-user:ec2-user /home/ec2-user/minecraft/auto-starter.sh

cat << EOF > /etc/systemd/system/minecraft.service
[Unit]
Description=Minecraft Server
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/minecraft
ExecStart=/home/ec2-user/minecraft/auto-starter.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
    
systemctl daemon-reexec
systemctl daemon-reload
systemctl enable minecraft
systemctl start minecraft
echo "SQUD [info] 모든 준비가 완료되어 서버를 실행합니다."`
  ,
  terraria: 
    `#!/bin/bash
sudo dnf install -y dotnet-runtime-6.0

cd /home/ec2-user
mkdir -p terraria
chown -R ec2-user:ec2-user /home/ec2-user/terraria
cd terraria

sudo -u ec2-user wget https://github.com/Pryaxis/TShock/releases/download/v5.2.4/TShock-5.2.4-for-Terraria-1.4.4.9-linux-amd64-Release.zip -O tshock.zip
sudo -u ec2-user unzip tshock.zip
sudo -u ec2-user tar -xf TShock-Beta-linux-x64-Release.tar

chmod +x TShock.Server

sudo -u ec2-user ./TShock.Server & 
sleep 20
pkill TShock.Server

cd tshock
sed -i 's/"RestApiEnabled": false/"RestApiEnabled": true/' config.json
sed -i 's/"EnableTokenEndpointAuthentication": false/"EnableTokenEndpointAuthentication": true/' config.json
sed -i 's/"LogRest": false/"LogRest": true/' config.json
sed -i 's/"ApplicationRestTokens": {}/"ApplicationRestTokens": { "${process.env.RCON_PASSWORD}": { "userGroupName": "superadmin", "UserName": "admin" } }/' config.json
sed -i 's/"BackupInterval": 10/"BackupInterval": 5/' config.json


echo "SQUD [info] 서버 실행준비 완료"
echo "SQUD [info] 게임서버를 서비스로 등록합니다."

cat << EOF > /home/ec2-user/terraria/auto-starter.sh
#!/bin/bash
cd /home/ec2-user/terraria
./TShock.Server -autocreate 2 -world /home/ec2-user/terraria/MyWorld.wld -worldname "MyWorld"
EOF
    
chmod +x /home/ec2-user/terraria/auto-starter.sh
chown ec2-user:ec2-user /home/ec2-user/terraria/auto-starter.sh

cat << EOF > /etc/systemd/system/tshock.service
[Unit]
Description=Terraria TShock Server
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/terraria
ExecStart=/home/ec2-user/terraria/auto-starter.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable tshock
systemctl start tshock
echo "SQUD [info] 모든 준비가 완료되어 서버를 실행합니다."`
    ,
//   추가할거 있으면 이렇게:
//     "하고 여기에 명령어"
//   
};