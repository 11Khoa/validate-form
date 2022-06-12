var data = {
    formValue: {
        fullname: 'Faith Davis',
        password: 'Pa$$w0rd!',
        password_confirmation: 'Pa$$w0rd!',
        gender: 'female',
        province: 'Tay Ninh',
        job: '短大生',
        color: ['xanh', 'đỏ', 'tím']
    }
}

var html=[]

for (const [key, value] of Object.entries(data.formValue)) {
    // console.log(`${key}: ${value}`);
    html.push(`
        <dl>
            <dt>${key}</dt>
            <dd>${value}</dd>
        </dl>
    `)
}

console.log(html.join(''));