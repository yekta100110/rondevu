import { buildNonDelegationCredentials } from "@rondevu/lib/delegationCredential";
import { prisma } from "@rondevu/prisma";
import type { Prisma } from "@rondevu/prisma/client";  
import type { AppCategories } from "@rondevu/prisma/client";
import { credentialForCalendarServiceSelect } from "@rondevu/prisma/selects/credential";

export class PrismaCredentialRepository {
    constructor(private readonly prismaClient: typeof prisma){}

    async findNonDelegationCredentialsByAppCategories({
        idToSearchObject,  
        appCategories,
    }: {
        idToSearchObject: Prisma.CredentialWhereInput;  
        appCategories: AppCategories[];  
    }){

        const credentials = await this.prismaClient.credential.findMany({
            where: {
                ...idToSearchObject,
                app: {
                    categories: {
                        hasSome: appCategories
                    }
                }
            },
            select: {
                ...credentialForCalendarServiceSelect,
                team: {
                    select: {
                        name: true
                    }
                }
            }
        })


        return buildNonDelegationCredentials(credentials)
    }
}