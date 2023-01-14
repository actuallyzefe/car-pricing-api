import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// Bu 3 şey birer Decarator

// Genelde Entity Class oluştururken => class adını Neyin Entitiysini oluşturuyorsak onu yazarak bırakırız ama bu tabiki optional bir şey
// Bunun içerisine de tıpkı Schemalarda yaptığımız gibi olması gereknelerı tanımlıyoruz
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
