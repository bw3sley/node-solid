import { describe, expect, it } from "vitest";

import { Appointment } from "../entities/appointment";

import { InMemoryAppointmentRepository } from "../repositores/in-memory/in-memory-appointments-repository";

import { getFutureDate } from "../tests/utils/get-future-date";

import { CreateAppointment } from "./create-appointment";

describe("Create Appointment", () => {
    it("should be able to create an appointment", () => {
        const appointmentRepository = new InMemoryAppointmentRepository();
        const createAppointment = new CreateAppointment(
            appointmentRepository
        );

        const startsAt = getFutureDate("2023-01-10");
        const endsAt = getFutureDate("2023-01-11");

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt,
            endsAt
        })).resolves.toBeInstanceOf(Appointment)
    })
    
    it("should not be able to create an appointment with overlapping dates", async () => {
        const appointmentRepository = new InMemoryAppointmentRepository();
        const createAppointment = new CreateAppointment(
            appointmentRepository
        );

        const startsAt = getFutureDate("2023-01-10");
        const endsAt = getFutureDate("2023-01-15");

        await createAppointment.execute({
            customer: "John Doe",
            startsAt,
            endsAt
        })

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt: getFutureDate("2023-01-14"),
            endsAt: getFutureDate("2023-01-18")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt: getFutureDate("2023-01-08"),
            endsAt: getFutureDate("2023-01-12")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt: getFutureDate("2023-01-08"),
            endsAt: getFutureDate("2023-01-17")
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: "John Doe",
            startsAt: getFutureDate("2023-01-11"),
            endsAt: getFutureDate("2023-01-12")
        })).rejects.toBeInstanceOf(Error)
    })
})