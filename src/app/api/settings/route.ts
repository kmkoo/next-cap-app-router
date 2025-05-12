let dummyUserSettings = {
  emailNotification: true,
  smsNotification: false,
  darkMode: false,
  largeText: false,
};

export async function GET() {
  return Response.json(dummyUserSettings);
}

export async function PATCH(req: Request) {
  const updatedSettings = await req.json();
  dummyUserSettings = { ...dummyUserSettings, ...updatedSettings };
  return Response.json({ success: true, settings: dummyUserSettings });
}
