let dummyUserSettings = {
  emailNotification: false,
  showServerAddress: false,
};

export async function GET() {
  return Response.json(dummyUserSettings);
}

export async function PATCH(req: Request) {
  const updatedSettings = await req.json();
  dummyUserSettings = { ...dummyUserSettings, ...updatedSettings };
  return Response.json({ success: true, settings: dummyUserSettings });
}
