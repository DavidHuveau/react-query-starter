import { useForm } from "react-hook-form";
import { User } from "./types";

export type UserForm = Omit<User, "id" | "address" | "phone" | "website" | "company">;

const UserForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<UserForm>();

  const onSubmit = (data: UserForm) => {
    alert(JSON.stringify(data));
  };

  console.log(errors);
  console.log(watch("name")) 

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="Name"
          placeholder="bill"
          {...register("name", { required: true, maxLength: 10 })}
        />
      {errors?.name && errors.name.type === "required" && <p>Name is required</p>}
      {errors?.name && errors.name.type === "maxLength" && <p>MaxLength is reached</p>}
      </div>

      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          placeholder="billou"
          {...register("username", { required: true, maxLength: 10 })}
        />
      {errors?.username && errors.username.type === "required" && <p>Username is required</p>}
      {errors?.username && errors.username.type === "maxLength" && <p>MaxLength is reached</p>}
      </div>

      <div>
        <label htmlFor="isDeveloper">Is a developer?</label>
        <input
          type="checkbox"
          id="isDeveloper"
          value="yes"
          {...register("isDeveloper")}
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="bill@hotmail.com"
          {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
        />
      {errors?.email && errors.email.type === "required" && <p>Email is required</p>}
      {errors?.email && errors.email.type === "pattern" && <p>Email is not valid</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default UserForm;
