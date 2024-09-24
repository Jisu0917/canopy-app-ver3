import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const initData = async () => {
  try {
    // Check if data already exists
    const adminCount = await prisma.admin.count();

    if (adminCount > 0) {
      console.log("Data already exists, skipping initialization.");
      return;
    }

    // Clear existing data
    await prisma.control.deleteMany({});
    await prisma.canopy.deleteMany({});
    await prisma.buyer.deleteMany({});
    await prisma.location.deleteMany({});
    await prisma.admin.deleteMany({});

    // Insert Admin data
    const existingAdmin = await prisma.admin.findUnique({
      where: { user_id: "jisupark" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("pw1234567", 10); // 비밀번호를 해시
      await prisma.admin.create({
        data: {
          user_id: "jisupark",
          password: hashedPassword,
          name: "박지수",
        },
      });
    }

    // Insert Buyer data
    const existingBuyer = await prisma.buyer.findUnique({
      where: { user_id: "dongjak123" },
    });

    if (!existingBuyer) {
      const hashedPassword = await bcrypt.hash("pw567890", 10); // 비밀번호를 해시
      await prisma.buyer.create({
        data: {
          user_id: "dongjak123",
          password: hashedPassword,
          region: "동작구",
          supervisor_name: "김창환",
          supervisor_phone: "010-1234-5678",
        },
      });
    }

    // Insert Location data
    const locationData: { [key: string]: string } = {
      동작구: "동작구 상도동 성대로 17길 22", // 예시 데이터
    };

    for (const [region, address] of Object.entries(locationData)) {
      let location = await prisma.location.findUnique({
        where: { address },
      });

      if (!location) {
        location = await prisma.location.create({
          data: {
            region,
            address,
          },
        });
      }

      // Insert Canopy data
      const existingCanopy = await prisma.canopy.findFirst({
        where: {
          manage_number: "동작-01",
          class_number: "서울동작-OP-240812",
          location_id: location.id,
        },
      });

      if (!existingCanopy) {
        const createdCanopy = await prisma.canopy.create({
          data: {
            manage_number: "동작-01",
            class_number: "서울동작-OP-240812",
            location_id: location.id,
            buyer_id: existingBuyer?.id || 1,
            status_fold: true,
            status_motor: false,
            status_led: true,
            status_sound: false,
            status_inform: true,
            status_temperature: 22.5,
            status_transmit: true,
          },
        });

        // Insert Control data
        await prisma.control.create({
          data: {
            canopy_id: createdCanopy.id,
            buyer_id: existingBuyer?.id || 1,
            fold: true,
            motor: false,
            led: true,
            sound: false,
            inform: true,
            timestamp: new Date().toISOString(), // 현재 시간을 저장
          },
        });
      }
    }

    console.log("Database initialized with sample data.");
  } catch (error) {
    console.error("Error initializing the database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the initialization
initData().catch(console.error);
