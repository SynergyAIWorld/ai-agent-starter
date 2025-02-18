import { db } from "./client";

async function main() {
  console.log(`Init System ...`);

  const admin = await db.user.upsert({
    where: {
      email: "superman@bladegame",
    },
    create: {
      name: "Admin",
      username: "superman",
      email: "superman@bladegame",
      role: 1,
      emailVerified: null,
    },
    update: {},
  });

  //create default referral code
  const setInit = db.userSetting.create({
    data: {
      key: "systemInit",
      valType: "num",
      value: "1",
      createdBy: admin.id,
    },
  });
  const resetUserProfile = db.userProfile.updateMany({
    where: { status: 0 },
    data: {
      referralCode: null,
      remaining: 0,
      remarks: null,
    },
  });
  await db.$transaction([setInit, resetUserProfile]);
  console.log(`Init System finished`);
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
