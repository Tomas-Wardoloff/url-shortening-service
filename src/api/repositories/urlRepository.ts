import prisma from "../config/prisma.js";

import { Links } from ".prisma/client";

class UrlRepository {
  async create(originalUrl: string, userId: number, description?: string) {
    return await prisma.links.create({
      data: {
        url: originalUrl,
        description: description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getOne(shortCode: string) {
    return await prisma.links.findFirst({
      where: {
        shortCode: shortCode,
      },
    });
  }

  async delete(shortCode: string) {
    return await prisma.links.delete({
      where: {
        shortCode: shortCode,
      },
    });
  }

  async update(
    shortCode: string,
    urlData: Partial<Omit<Links, "id" | "userId" | "createdAt">>
  ) {
    return await prisma.links.update({
      where: {
        shortCode: shortCode,
      },
      data: urlData,
    });
  }
}

export default UrlRepository;
