import { mergeResolvers } from "@graphql-tools/merge";

import { Department, Nurse, Bed, Patient } from "../database/index.js";

import DepartmentResolver from "./department.resolver.js";
import BedResolver from "./bed.resolver.js";
import NurseResolver from "./nurse.resolver.js";
import PatientResolver from "./patient.resolver.js";

const resolvers = mergeResolvers([DepartmentResolver, BedResolver, NurseResolver, PatientResolver])

export default resolvers