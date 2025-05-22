const API_URL = "http://localhost:8080/backFacturacionElectronica/";

export async function createClient(client) {
  try {
    const res = await fetch(`${API_URL}persona/newPerson`, {
      method: "POST",
      body: JSON.stringify(client),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const data = await res.json();
    console.log("DATA RECIBIDA");
    console.log(data);
    return data;
  } catch {
    throw Error("ERROR CREANDO EL CLIENTE");
  }
}

export async function createProduct(product) {
  try {
    const response = await fetch(`${API_URL}product/newProduct`, {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw Error;
    const data = await response.json();
    console.log("DATA RECIBIDA");
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw Error("Error al crear el producto");
  }
}

export async function getInitFactura(cempresa) {
  try {
    const res = await fetch(`${API_URL}factura/initFactura`, {
      method: "POST",
      body: JSON.stringify(cempresa),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const data = await res.json();
    console.log("DATA RECIBIDA");
    console.log(data);
    return data;
  } catch {
    throw Error("ERROR INIT FACTURA");
  }
}

export async function getClient4Identification(identification) {
  try {
    const res = await fetch(`${API_URL}persona/findPersonByName`, {
      method: "POST",
      body: JSON.stringify(identification),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const data = await res.json();
    console.log("RESULTADO DEL CLIENTE");
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getProduct4cempresa(cempresa) {
  try {
    const res = await fetch(`${API_URL}product/listProduct`, {
      method: "POST",
      body: JSON.stringify(cempresa),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const data = await res.json();
    console.log("PRODUCTOS DEL CLIENTE");
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function sendFactura(factura) {
  try {
    const res = await fetch(`${API_URL}factura/createFactura`, {
      method: "POST",
      body: JSON.stringify(factura),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw Error();
    const data = await res.json();
    console.log("PRODUCTOS DE LA FACTURA");
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getClients(cempresa) {
  try {
    const response = await fetch(`${API_URL}persona/listPerson`, {
      method: "POST",
      body: JSON.stringify(cempresa),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response) throw Error();
    const data = await response.json();
    console.log("Los datos de la lista");
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getProducts(cempresa) {
  try {
    const resp = await fetch(`${API_URL}product/listProduct`, {
      method: "POST",
      body: JSON.stringify(cempresa),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) throw Error();
    const data = await resp.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getProduct4Id(cproducto) {
  try {
    const resp = await fetch(`${API_URL}product/getProduct4Id`, {
      method: "POST",
      body: JSON.stringify(cproducto),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!resp.ok) throw Error();
    const data = await resp.json();
    return data;
  } catch (Error) {
    console.log(Error);
    return null;
  }
}

export async function updateProduct(producto) {
  try {
    const resp = await fetch(`${API_URL}product/editProduct`, {
      method: "POST",
      body: JSON.stringify(producto),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!resp.ok) throw Error;
    const data = resp.json();
    return data;
  } catch (Error) {
    console.log(Error);
    return null;
  }
}

export async function getCliente4Id(persona) {
  try {
    const data = await fetch(`${API_URL}persona/findPersonById`, {
      method: "POST",
      body: JSON.stringify(persona),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data.ok) throw Error;
    const res = data.json();
    return res;
  } catch (Error) {
    console.error(Error);
    return null;
  }
}
