import React from 'react';

export function CreateGroup() {
  return (
    <main className="container-fluid bg-secondary text-center">
    <div className="form-format">
        <form className="form-format" action = "./chat.html"> 
            <input className="form-input-format" type="text" required placeholder="Group Name"/>
            <button className="form-input-format" type="submit">Create Group</button>
        </form>
    </div>
    </main>
  );
}