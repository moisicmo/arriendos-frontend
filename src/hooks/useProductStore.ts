import { useDispatch, useSelector } from 'react-redux';
import { coffeApiKevin, coffeApiLeandro } from '@/services';
import { refreshProduct, setProducts, setLeakedProducts, setLeases } from '@/store';
import Swal from 'sweetalert2';
import { ProductModel } from '@/models';

export const useProductStore = () => {
    const { products, flag, leakedProducts } = useSelector((state: any) => state.products);
    const dispatch = useDispatch();

    const getProducts = async ({ page, limit, isFilter }: { page: number, limit: number, isFilter: boolean }) => {
        if(!isFilter) {
            console.log('OBTENIENDO TODOS LOS PRODUCTOS')
            const { data } = await coffeApiKevin.get(`/product/?page=${page}&limit=${limit}`);
            console.log(data)
            dispatch(setProducts({ products: data.products }));
            return data.total
        } else {
            console.log('OBTENIENDO PRODUCTOS FILTRADOS')
            const { data } = await coffeApiKevin.get(`/product/?page=${page}&limit=${limit}`);
            console.log(data)
            dispatch(setProducts({ products: data.products }));
            return data.total
        }
    }

    const postCreateProduct = async (body: object) => {
        try {
            console.log('CREANDO UN NUEVO PRODUCTO');
            console.log(body)
            const { data } = await coffeApiLeandro.post(`/product/`, body);
            console.log(data)
            dispatch(refreshProduct());
            Swal.fire('Producto creado correctamente', '', 'success');
        } catch (error: any) {
            Swal.fire('Oops ocurrio algo', error.response, 'error');
        }
    }

    const patchUpdateProduct = async (id: number, body: object) => {
        try {
            console.log('EDITANDO PRODUCTO');
            const { data } = await coffeApiLeandro.patch(`/product/${id}`, body);
            console.log(data)
            dispatch(refreshProduct());
            Swal.fire('Producto editado correctamente', '', 'success');
        } catch (error: any) {
            Swal.fire('Oops ocurrio algo', error.response, 'error');
        }
    }

    const deleteRemoveProduct = async (product: ProductModel) => {

        Swal.fire({
            title: '¿Estás seguro?',
            text: `Estas eliminando al producto: ${product.room.name} - ${product.rate.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Sí, estoy seguro!',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    console.log('ELIMINANDO UN PRODUCTO')
                    const { data } = await coffeApiLeandro.delete(`/product/${product.id}`)
                    console.log(data)
                    dispatch(refreshProduct());
                    Swal.fire(
                        `¡Listo!`,
                        `${product.room.name} - ${product.rate.name} fue eliminado`,
                        'success'
                    )
                } catch (error: any) {
                    throw Swal.fire('Oops ocurrio algo', error.response.data.detail, 'error');
                }
            }
        })
    }

    const postLeakedProduct = async (body: object) => {
        try {
            // console.log('OBTENIENDO PRODUCTOS FILTRADOS')
            // console.log(body)
            const { data } = await coffeApiLeandro.post('/product/Posible_product/', body)
            // console.log(data)
            // dispatch(setLeakedProducts({products:data.products}))
            return data.products;
        } catch(error: any) {
            Swal.fire('Oops ocurrio algo', error.response, 'error')
        }
    }

    const setLeakedProductReload = async (array:any)=>{
        console.log(`array ${array}`)
        dispatch(setLeakedProducts({products: array}))
    }

    const postCreateLeases = async (body: object) => {
        try {
            const { data } = await coffeApiKevin.post('/leases/', body)

            Swal.fire('Producto creado correctamente', '', 'success');
        } catch(error: any) {
            Swal.fire('Oops ocurrio algo', error.response, 'error')
        }
    }

    const getLeases = async () => {
        try {
            console.log("OBTENIENDO ARRIENDOS")
            const { data } = await coffeApiKevin.get('/leases/')
            dispatch(setLeases({ leases: data }))
            console.log(data)
        } catch(error:any) {
            Swal.fire('Oops ocurrio algo', error.response, 'error')
        }
    }


    return {
        //* Propiedades
        products,
        flag,
        leakedProducts,
        //* Métodos
        getProducts,
        postCreateProduct,
        patchUpdateProduct,
        deleteRemoveProduct,
        postLeakedProduct,
        setLeakedProductReload,
        postCreateLeases,
        getLeases
    }
}