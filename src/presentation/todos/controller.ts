import { Request, Response } from "express";
import { Prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";

const todos1 = [
  { id: 1, text: "Buy milk", createdAt: new Date() },
  { id: 2, text: "Buy bread", createdAt: null },
  { id: 3, text: "Buy butter", createdAt: new Date() },
];

export class TodosController {
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await Prisma.todo.findMany();
    return res.json(todos);
  };

  public getTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    const todo = await Prisma.todo.findFirst({
      where: {
        id,
      },
    });

    todo
      ? res.json(todo)
      : res.status(404).json({ error: `Todo with id ${id} not found` });
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);

    if (error) return res.status(400).json({ error });

    const todo = await Prisma.todo.create({
      data: createTodoDto!,
    });

    res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });

    if (error) return res.status(400).json({ error });

    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    const todo = await Prisma.todo.findFirst({
      where: {
        id,
      },
    });

    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    const updateTodo = await Prisma.todo.update({
      where: {
        id,
      },
      data: updateTodoDto!.values,
    });

    res.json(updateTodo);
  };

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    if (isNaN(id))
      return res.status(400).json({ error: "ID argument is not a number" });

    const todo = await Prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo)
      return res.status(404).json({ error: `Todo with id ${id} not found` });

    await Prisma.todo.delete({
      where: {
        id,
      },
    });

    res.json(todo);
  };
}
