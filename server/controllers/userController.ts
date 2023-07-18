import User from '../models/User.ts';
import controllerFactory from './controllerFactory.ts';

const getAllUsers = controllerFactory.getAll(User);
const createUser = controllerFactory.createOne(User);

export default { getAllUsers, createUser };
