
export async function FileReador(event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {

    const fileList = event.target.files as FileList;
    const file = fileList[0] as File;
    console.log(file);

    const ext = file.name.split('.')?.pop()?.toLowerCase() || '';

    if (ext === 'xlsx') {
        return file;
    }
    else if (ext === 'csv') {
        return file; 
    }

    return null;
}

