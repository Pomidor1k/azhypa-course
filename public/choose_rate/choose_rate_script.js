window.addEventListener('DOMContentLoaded', async () => {
    const tg = window.Telegram.WebApp
    tg.expand()
    



    const chosenRate = document.querySelectorAll('.rate__wrapper')
    chosenRate.forEach(item => {
        item.addEventListener('click', async () => {
            const rateLevel = item.id
            console.log(rateLevel);
            if (rateLevel === 'basic') {
                tg.MainButton.color = '#FF6B00'
                tg.MainButton.text = 'BASIC'
                tg.MainButton.show()
            } else if (rateLevel === 'advanced') {
                tg.MainButton.color = '#00FF85'
                tg.MainButton.text = 'ADVANCED'
                tg.MainButton.show()
            } else if (rateLevel === 'pro') {
                tg.MainButton.color = '#FF003D'
                tg.MainButton.text = 'PRO'
                tg.MainButton.show()
            }

            tg.MainButton.onClick(async () => {
                await fetch("/rate-is-chosen", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: tg.initDataUnsafe.user.id,
                    rateLevel: rateLevel
                })
            })
            .then(
                tg.close()
            )
            }) 
        })
    })
})