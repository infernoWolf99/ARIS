# NestJS + Prisma + PostgreSQL Backend Integration Guide
## Ghana Health Service (GHS) ARIS Antenatal Care Platform

This application is fully equipped and typed for seamless integration with a NestJS REST API backend connected to PostgreSQL via Prisma ORM.

---

## 1. Quick Architecture Overview

- **Frontend Tech**: React 18, Vite, TypeScript, Tailwind CSS
- **Backend Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma ORM
- **API Management**: Postman Collection (`/postman/aris_ghs_nest_api.postman_collection.json`)

---

## 2. Prisma Database Migration

The Prisma schema is pre-configured in `prisma/schema.prisma`. To initialize PostgreSQL:

```bash
# 1. Set environment variable in NestJS .env file
DATABASE_URL="postgresql://postgres:password@localhost:5432/aris_ghs_db?schema=public"

# 2. Push schema to PostgreSQL or run migration
npx prisma db push
# or
npx prisma migrate dev --name init
```

---

## 3. NestJS Module & Controller Example

Here is a ready-to-use NestJS `PatientsController` and `PatientsService` implementation matching the frontend API requests:

### `src/patients/patients.controller.ts`
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto, UpdatePatientDto } from './dto/patient.dto';

@Controller('api/v1/patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll() {
    return {
      statusCode: 200,
      data: await this.patientsService.findAll(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      statusCode: 200,
      data: await this.patientsService.findOne(id),
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    return {
      statusCode: 201,
      data: await this.patientsService.create(createPatientDto),
      timestamp: new Date().toISOString(),
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return {
      statusCode: 200,
      data: await this.patientsService.update(id, updatePatientDto),
      timestamp: new Date().toISOString(),
    };
  }
}
```

---

## 4. Postman API Collection Import

1. Open **Postman**.
2. Click **Import** -> Select `postman/aris_ghs_nest_api.postman_collection.json` from this repository.
3. Set the `baseUrl` variable to `http://localhost:3000/api/v1` (or your NestJS server URL).
4. Run requests for `Patients`, `ANC Visits`, `Khaya AI Translation`, and `Speech Synthesis`.

---

## 5. Connecting Frontend to NestJS

In your `.env` or Vite environment settings:
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_USE_NEST_API=true
```

You can also switch modes dynamically using the **NestJS Backend Portal** inside the app top navigation bar.
